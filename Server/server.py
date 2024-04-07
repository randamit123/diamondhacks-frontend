from flask import Flask, render_template, Response, jsonify
import cv2
import numpy as np
import os
import mediapipe as mp
from re import S
from sklearn.model_selection import train_test_split
from sklearn.metrics import multilabel_confusion_matrix, accuracy_score
from tensorflow import keras
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import LSTM, Dense
import requests
from flask_cors import CORS

app = Flask(__name__)
camera = cv2.VideoCapture(0)
CORS(app)

# Landmarks using MediaPipe Holistic
mp_holistic = mp.solutions.holistic  # Holistic model
mp_drawing = mp.solutions.drawing_utils  # Drawing utils

# opencv feeds uses bgr but mediapipe need rgb


def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # convert BGR to RGB
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # convert RGB to BGR
    return image, results


# draw landmarks/connections on actual image
def draw_landmarks(image, results):
    mp_drawing.draw_landmarks(
        image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
    mp_drawing.draw_landmarks(
        image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
    mp_drawing.draw_landmarks(
        image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)


def extract_keypoints(results):
    pose = np.array([[result.x, result.y, result.z, result.visibility]
                     for result in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(132)
    lh = np.array([[result.x, result.y, result.z]
                   for result in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[result.x, result.y, result.z]
                   for result in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])

# Function to resize frames
def resize_frame(frame, width, height):
    return cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)


DATA_PATH = os.path.join('alphabet')
actions = np.array(['0space', '0del', '0nothing', '1hello', '1thanks', '1world', 'a', 'b', 'c', 'd', 'e',
                   'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
                   'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
num_sequences = 120
sequence_length = 30
def load_model():
    model = Sequential()
    model.add(LSTM(64, return_sequences=True,
            activation='relu', input_shape=(30, 258)))
    model.add(LSTM(128, return_sequences=True,
            activation='relu', input_shape=(30, 258)))
    model.add(LSTM(64, return_sequences=False,
            activation='relu', input_shape=(30, 258)))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(actions.shape[0], activation='softmax'))

    model.compile(optimizer='Adam', loss='categorical_crossentropy',
                metrics=['categorical_accuracy'])

    model.load_weights("action.keras")
    return model

colors = [(245, 117, 16), (117, 245, 16), (16, 117, 245)]
def probability_display(res, actions, input_frame, colors):
    output_frame = input_frame.copy()

    # Sort the probabilities and actions based on probabilities, get top 3
    sorted_indices = np.argsort(res)[::-1][:3]
    sorted_probs = res[sorted_indices]
    sorted_actions = actions[sorted_indices]

    for num, (prob, action) in enumerate(zip(sorted_probs, sorted_actions)):
        cv2.rectangle(output_frame, (0, 60+num*40),
                      (int(prob*100), 90+num*40), colors[num], -1)
        cv2.putText(output_frame, action, (0, 85+num*40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

    return output_frame

model = load_model()
sequence = []
sentence = []
predictions = []
threshold = 0.95  # mess with threshold
def generate_frames(width, height):
    global sequence
    global sentence
    global predictions
    global threshold
    global model
    with mp_holistic.Holistic() as holistic:
        while True:
            # Read the camera frame
            success, frame = camera.read()
            if not success:
                break
            else:
                # Resize the frame based on percentage or fraction
                frame_width = int(frame.shape[1] * width) if 0 < width < 1 else width
                frame_height = int(frame.shape[0] * height) if 0 < height < 1 else height
                frame = resize_frame(frame, frame_width, frame_height)
                # Center the image
                top_margin = (frame_height - frame.shape[0]) // 2
                left_margin = (frame_width - frame.shape[1]) // 2
                centered_frame = cv2.copyMakeBorder(frame, top_margin, top_margin, left_margin, left_margin, cv2.BORDER_CONSTANT, value=(0, 0, 0))
                
                # Make detections
                image, results = mediapipe_detection(centered_frame, holistic)

                # Draw landmarks
                draw_landmarks(image, results)

                # Prediction logic
                keypoints = extract_keypoints(results)
                sequence.append(keypoints)
                sequence = sequence[-30:]

                if len(sequence) == 30:
                    res = model.predict(np.expand_dims(sequence, axis=0))[0]
                    print(actions[np.argmax(res)])
                    predictions.append(np.argmax(res))

                    # Display results
                    if np.unique(predictions[-10:])[0] == np.argmax(res):
                        if res[np.argmax(res)] > threshold:

                            if len(sentence) > 0:
                                if actions[np.argmax(res)] != sentence[-1]:
                                    sentence.append(actions[np.argmax(res)])
                                    predictions_data = {'predictions': sentence}
                                    requests.post('http://localhost:8080/predictions', json=predictions_data)
                            else:
                                sentence.append(actions[np.argmax(res)])

                    if len(sentence) > 5:
                        sentence = sentence[-5:]

                    image = probability_display(res, actions, centered_frame, colors)

                cv2.rectangle(image, (0, 0), (640, 40), (245, 117, 16), -1)
                cv2.putText(image, ' '.join(sentence), (3, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                    

                    # Encode the frame into JPEG format
                ret, buffer = cv2.imencode('.jpg', centered_frame)
                frame = buffer.tobytes()

                yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predictions')
def send_predictions():
    return jsonify(predictions=sentence)

@app.route('/video')
def video():
    # Define the desired width and height for the camera feed
    # Width and height specified as percentages or fractions (0 to 1)
    width = 0.55  # 55% of the original frame width
    height = 0.55  # 55% of the original frame height
    return Response(generate_frames(width, height), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True, port=8080)
