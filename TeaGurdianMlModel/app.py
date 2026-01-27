from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import json
import tensorflow as tf

app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model(
    "model/tea_leaf_model.h5",
    compile=False
)

with open("labels.json") as f:
    LABELS = json.load(f)

def preprocess(img):
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    return np.expand_dims(img, axis=0)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = Image.open(request.files["image"]).convert("RGB")
    input_tensor = preprocess(image)

    preds = model.predict(input_tensor)[0]
    index = int(np.argmax(preds))

    return jsonify({
        "label": LABELS[index],
        "confidence": float(preds[index])
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
