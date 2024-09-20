import os
import cv2
from flask import Flask, request, render_template, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from fer import FER

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize FER for emotion detection
emotion_detector = FER()

# Load Age and Gender models from the 'models/' directory
age_model = cv2.dnn.readNetFromCaffe('models/age_deploy.prototxt', 'models/age_net.caffemodel')
gender_model = cv2.dnn.readNetFromCaffe('models/gender_deploy.prototxt', 'models/gender_net.caffemodel')

# Define age and gender parameters
AGE_LIST = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
GENDER_LIST = ['Male', 'Female']

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Function to detect faces, emotions, age, and gender
def detect_faces_emotions_age_gender(image_path):
    image = cv2.imread(image_path)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Detect emotions using FER
    emotions = emotion_detector.detect_emotions(rgb_image)
    
    faces = []
    for emotion in emotions:
        face_info = {
            'box': emotion['box'],         # Coordinates of the face
            'emotions': emotion['emotions'] # Detected emotions with confidence scores
        }
        face = image[emotion['box'][1]:emotion['box'][1] + emotion['box'][3], emotion['box'][0]:emotion['box'][0] + emotion['box'][2]]

        # Gender detection
        face_blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), (104.0, 177.0, 123.0))
        gender_model.setInput(face_blob)
        gender_preds = gender_model.forward()
        gender = GENDER_LIST[gender_preds[0].argmax()]

        # Age detection
        age_model.setInput(face_blob)
        age_preds = age_model.forward()
        age = AGE_LIST[age_preds[0].argmax()]

        face_info['gender'] = gender
        face_info['age'] = age
        faces.append(face_info)
    
    return faces

# Function to draw vertical text on the image
def draw_faces_emotions_age_gender(image_path, faces):
    image = cv2.imread(image_path)
    
    for face in faces:
        x, y, width, height = face['box']
        # Draw the bounding box around the face
        cv2.rectangle(image, (x, y), (x + width, y + height), (255, 0, 0), 2)
        
        # Draw each line of text above the face
        dominant_emotion = max(face['emotions'], key=face['emotions'].get)
        texts = [
            f"emotion: {dominant_emotion}",
            f"gender: {face['gender']}",
            f"age: {face['age']}"
        ]
        
        # Starting position for the text (just above the face bounding box)
        text_x = x
        text_y = y - 10  # Just above the bounding box
        
        # Font parameters
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 1
        font_color = (255, 255, 255)  # Green color
        thickness = 2
        line_height = 30  # Space between lines of text
        
        # Loop through the texts and draw each line
        for i, text in enumerate(texts):
            cv2.putText(image, text, (text_x, text_y - i * line_height), font, font_scale, font_color, thickness)

    # Save the processed image with results
    result_filename = 'result_' + os.path.basename(image_path)
    result_path = os.path.join(app.config['UPLOAD_FOLDER'], result_filename)
    cv2.imwrite(result_path, image)
    
    return result_filename

# Route to render the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle file uploads and detection
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Perform face, emotion, age, and gender detection
        faces = detect_faces_emotions_age_gender(filepath)

        # Draw results on the image
        result_filename = draw_faces_emotions_age_gender(filepath, faces)

        # Redirect to page to display processed image
        return redirect(url_for('uploaded_file', filename=result_filename))

    return redirect(request.url)

# Route to serve the uploaded/processed image
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
