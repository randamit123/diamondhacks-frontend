import cv2
import mediapipe as mp
from flask import Flask, jsonify, Response
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
#CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/')
def hello_world():
    return jsonify({'message': "Hello World"}
                   )
""" def generate_frames():
    cap = cv2.VideoCapture(0)
    with mp.solutions.holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Process frame with MediaPipe Holistic
            # Perform your landmark detection and pose estimation here
            # Example:
            # results = holistic.process(frame)

            # Convert processed frame to JPEG format
            # Example: Encode processed frame to JPEG bytes
            # encoded_frame = cv2.imencode('.jpg', frame)[1].tobytes()

            # Yield processed frame as byte stream
            # Example: yield encoded_frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame.tobytes() + b'\r\n')

    cap.release() """

""" def generate_frames():
    print("test")
    cap = cv2.VideoCapture(0)
    with mp.solutions.holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Process frame with MediaPipe Holistic
            # Example:
            # results = holistic.process(frame)
            
            # Encode frame as JPEG bytes
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # Emit frame data over WebSocket
            socketio.emit('frame', {'image': frame_bytes}, namespace='/')

    cap.release()

@socketio.on('connect', namespace='/home')
def ws_connect():
    print('Client connected')
    emit('server_response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/home')
def ws_disconnect():
    print('Client disconnected')

@app.route('/home')
def index():
    print("Streaming frames...")
    socketio.start_background_task(target=generate_frames)
    return "Streaming frames..."
 """

def generate_frames():
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=8080)
""" if __name__ == '__main__':
    #app.run(debug=True, port=8080)
    socketio.run(app, debug=True, port=8080) """