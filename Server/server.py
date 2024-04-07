import eventlet
eventlet.monkey_patch()

import cv2
from flask import Flask, jsonify, Response, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
camera=cv2.VideoCapture(0)
CORS(app)
#CORS(app)
socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins="http://localhost:3000")


def generate_frames():
    while True:
            
        ## read the camera frame
        success,frame=camera.read()
        if not success:
            break
        else:
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()

        yield(b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def video_feed():
    return Response(generate_frames(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 8080)), app)
