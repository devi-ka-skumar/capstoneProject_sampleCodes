from flask import Flask, request, jsonify
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing.image import img_to_array
import cv2
import numpy as np
import mysql.connector
import os
from werkzeug.utils import secure_filename
from collections import Counter
import bcrypt

app = Flask(__name__)

db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': '',
    'database': 'bloomwell',
    'port': '3306'
}

app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Emotion labels (adjust if your model uses a different set)
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def get_db_connection():
    return mysql.connector.connect(**db_config)

# Load model from JSON and weights
def load_emotion_model():
    with open('trained_outputs/model.json', 'r') as json_file:
        model_json = json_file.read()
    model = model_from_json(model_json)
    model.load_weights('trained_outputs/model.weights.h5')
    return model

model = load_emotion_model()

def preprocess_frame(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face = cv2.resize(gray, (48, 48))
    face = img_to_array(face)
    face = np.expand_dims(face, axis=0)
    face /= 255.0  # Normalize
    return face

@app.route('/predict', methods=['POST'])
def predict_emotion():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    filename = secure_filename(video.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video.save(filepath)

    cap = cv2.VideoCapture(filepath)
    emotion_counts = Counter()
    frame_skip = 5  # Analyze every 5th frame to reduce processing load
    frame_index = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_index % frame_skip == 0:
            try:
                face_input = preprocess_frame(frame)
                prediction = model.predict(face_input, verbose=0)[0]
                predicted_emotion = emotion_labels[np.argmax(prediction)]
                emotion_counts[predicted_emotion] += 1
            except Exception as e:
                print(f"Error processing frame {frame_index}: {e}")
        frame_index += 1

    cap.release()
    os.remove(filepath)  # Clean up uploaded file

    if not emotion_counts:
        return jsonify({'error': 'No valid frames for prediction'}), 500

    # Get emotion with highest frequency
    most_common_emotion = emotion_counts.most_common(1)[0]
    return jsonify({
        'predicted_emotion': most_common_emotion[0],
        'frequency': most_common_emotion[1],
        'full_distribution': dict(emotion_counts)
    })

@app.route("/hi", methods=["GET"])
def hi():
    return jsonify("Hi :D"), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM user WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'message': 'Login successful', 'user_id': user['id']})
    else:
        return jsonify({'error': 'Invalid username/email or password'}), 401

@app.route('/signup', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO user (first_name, last_name, email, password) VALUES (%s, %s, %s, %s)",
                       (firstName, lastName, email, password_hash))
        conn.commit()
        return jsonify({'message': 'User registered successfully'})
    except mysql.connector.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)
