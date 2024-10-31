from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

os.makedirs("static", exist_ok=True)

@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"


@app.route("/upload", methods=["POST"])
def upload_image():
  if "file" not in request.files:
    return jsonify({"error": "No file provided"}), 400

  file = request.files["file"]
  if file.filename == "":
    return jsonify({"error": "No selected file"}), 400

  # Save the file in the static folder
  file_path = os.path.join("static", file.filename)
  file.save(file_path)

  return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200




if __name__ == "__main__":
  app.run(port=5000)