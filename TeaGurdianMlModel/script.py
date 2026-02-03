from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
from keras.utils import load_img, img_to_array
import numpy as np
import os
from werkzeug.utils import secure_filename

# ---------------- Config ---------------- #
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- Load Model ---------------- #
MODEL_PATH = "tea_leaf_model.h5"  # path to your trained model
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Load class names (update manually if you don't have a labels file)
class_names = ["anthracnose",
  "algal_leaf",
  "bird_eye_spot",
  "brown_blight",
  "gray_blight",
  "healthy",
  "red_leaf_spot",
  "white_spot"]

# ---------------- Helper Functions ---------------- #
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img_path):
    IMG_SIZE = (224, 224)
    img = load_img(img_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = keras.applications.efficientnet.preprocess_input(img_array)
    return img_array

# ---------------- Routes ---------------- #
@app.route("/")
def index():
    return "Tea Leaf Disease Prediction API is running ✅"

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        img_array = preprocess_image(filepath)
        predictions = model.predict(img_array)
        predicted_class = class_names[np.argmax(predictions)]
        confidence = float(np.max(predictions))

        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence
        })

    return jsonify({"error": "File type not allowed"}), 400

# ---------------- Run App ---------------- #
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host="0.0.0.0", port=port)