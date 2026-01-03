from flask import Flask, request, send_file, send_from_directory
from rembg import remove
from PIL import Image
import io
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# 1. Serve Frontend (HTML/CSS/JS)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# 2. API: Remove Background
@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return "No image uploaded", 400
    
    file = request.files['image']
    input_image = Image.open(file.stream)
    
    # AI Processing
    output_image = remove(input_image)
    
    img_io = io.BytesIO()
    output_image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

# 3. API: Upscale (Basic 4x)
@app.route('/upscale', methods=['POST'])
def upscale_image():
    if 'image' not in request.files:
        return "No image uploaded", 400
    
    file = request.files['image']
    input_image = Image.open(file.stream)
    
    # Basic Upscale (For real AI upscale, heavy models are needed)
    new_size = (input_image.width * 4, input_image.height * 4)
    output_image = input_image.resize(new_size, Image.Resampling.LANCZOS)
    
    img_io = io.BytesIO()
    output_image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)