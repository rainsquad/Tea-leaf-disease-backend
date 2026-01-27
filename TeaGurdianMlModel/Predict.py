from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import tkinter as tk
from tkinter import filedialog

# Load trained model
model = load_model("tea_leaf_model.h5")

# Class names (update according to your dataset)
class_names = ['algal', 'bird_eye', 'brown_blight', 'gray_light', 'healthy', 'red_spot', 'white_spot']

# Open file dialog to select an image
root = tk.Tk()
root.withdraw()  # hide main window
img_path = filedialog.askopenfilename(title="Select Tea Leaf Image",
                                      filetypes=[("Image files", "*.jpg *.jpeg *.png")])

if not img_path:
    print("No image selected. Exiting...")
    exit()

# Load and preprocess image
img = image.load_img(img_path, target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Predict
pred = model.predict(img_array)
index = np.argmax(pred)

print("Predicted Class:", class_names[index])
print("Probability:", float(np.max(pred)))
