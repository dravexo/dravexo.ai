from flask import Flask, request, send_file
from flask_cors import CORS
from PIL import Image
import io
from rembg import remove
import socket

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
    print("\033[1;36mRemove backgrounds & upscale images to 4K instantly.\033[0m")
    print("Sorry for the inconvenience. Our service is currently available from 8:00 AM to 9:00 PM, and we’ll be launching a 24/7 server very soon.")

    # Show the IP address for mobile access
    try:
        # Connect to a public DNS server to get the correct local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        local_ip = "127.0.0.1"
    print(f"To access on mobile, use this URL: http://{local_ip}:5000")

    app.run(host="0.0.0.0", port=5000)