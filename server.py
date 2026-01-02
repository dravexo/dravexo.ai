from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import io
from rembg import remove

app = Flask(__name__)
CORS(app)  # Allow browser to communicate with this server

@app.route('/upscale', methods=['POST'])
def upscale():
    if 'image' not in request.files:
        return "No image uploaded", 400
    
    file = request.files['image']
    img = Image.open(file.stream)
    
    # Target 4K Resolution (Width: 3840px)
    target_width = 3840
    
    # Calculate height to maintain aspect ratio
    w_percent = (target_width / float(img.size[0]))
    h_size = int((float(img.size[1]) * float(w_percent)))
    
    # High-Quality Upscaling using LANCZOS Filter
    img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)
    
    # Save to buffer
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png')

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return "No image uploaded", 400
    
    file = request.files['image']
    input_image = file.read()
    output_image = remove(input_image)
    
    return send_file(io.BytesIO(output_image), mimetype='image/png')

if __name__ == '__main__':
    print("Starting Python Upscale Server on port 5000...")
    app.run(debug=True, port=5000)