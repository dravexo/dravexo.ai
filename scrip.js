/* ==========================================
   GLOBAL CONFIGURATION
   ========================================== */
// IMPORTANT: Mobile par chalane ke liye yahan apna Render/Railway URL dalein.
// Localhost (http://127.0.0.1:5000) mobile par kaam nahi karega.
const BACKEND_URL = "https://YOUR-APP-NAME.onrender.com"; 

/* ==========================================
   DOM ELEMENTS & SETUP
   ========================================== */
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const dropBox = document.getElementById("dropBox");
const resultImage = document.getElementById("resultImage");
const statusText = document.getElementById("statusText");

// Trigger Opening Animation (Moved from HTML)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/* ==========================================
   FILE HANDLING (Drag & Drop)
   ========================================== */
fileInput.addEventListener("change", function() {
  showPreview(this.files[0]);
});

dropBox.addEventListener("dragover", function(e) {
  e.preventDefault();
  dropBox.style.borderColor = "#333";
});

dropBox.addEventListener("dragleave", function() {
  dropBox.style.borderColor = "#a0a0a0";
});

dropBox.addEventListener("drop", function(e) {
  e.preventDefault();
  dropBox.style.borderColor = "#a0a0a0";

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    showPreview(file);
    // Sync with file input so form data works
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
  }
});

function showPreview(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    // Hide previous results if any
    if(resultImage) resultImage.style.display = "none";
    if(statusText) statusText.innerText = "";
  }
  reader.readAsDataURL(file);
}

/* ==========================================
   BUTTON ACTIONS (Editor & AI Backend)
   ========================================== */

// 1. Open Editor Logic
const openEditorBtn = document.querySelector(".open-editor-btn");
if (openEditorBtn) {
    openEditorBtn.addEventListener("click", function() {
        if (previewImage.style.display === "none" || !previewImage.src) {
            alert("Please select an image first!");
            return;
        }
        try {
            localStorage.setItem("uploadedImage", previewImage.src);
            window.location.href = "editor.html";
        } catch (e) {
            alert("Image too large for storage. Try a smaller image.");
        }
    });
}

// 2. AI Processing Logic (Upscale / Remove BG)
async function processImage(endpoint) {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image first!");
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  // UI Updates
  statusText.innerText = "Processing... Please wait (Server might be waking up)";
  statusText.style.color = "blue";
  resultImage.style.display = "none";
  
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    // Show Result
    resultImage.src = imageUrl;
    resultImage.style.display = "block";
    statusText.innerText = "Success! Image processed.";
    statusText.style.color = "green";
    
  } catch (error) {
    console.error(error);
    statusText.innerText = "Error: Could not connect to server. Check BACKEND_URL.";
    statusText.style.color = "red";
    alert("Mobile par chalne ke liye 'BACKEND_URL' sahi hona chahiye (Render/Railway link).");
  }
}

// Connect Buttons
const upscaleBtn = document.getElementById("upscaleBtn");
if(upscaleBtn) upscaleBtn.addEventListener("click", () => processImage('/upscale'));

const removeBgBtn = document.getElementById("removeBgBtn");
if(removeBgBtn) removeBgBtn.addEventListener("click", () => processImage('/remove-bg'));
