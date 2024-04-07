from flask import Flask, render_template, Response
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0)

# Function to resize frames
def resize_frame(frame, width, height):
    return cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)

def generate_frames(width, height):
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
            # Encode the frame into JPEG format
            ret, buffer = cv2.imencode('.jpg', centered_frame)
            frame = buffer.tobytes()

        yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    # Define the desired width and height for the camera feed
    # Width and height specified as percentages or fractions (0 to 1)
    width = 0.55  # 55% of the original frame width
    height = 0.55  # 55% of the original frame height
    return Response(generate_frames(width, height), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True, port=8080)
