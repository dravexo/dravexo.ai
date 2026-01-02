const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const dropBox = document.getElementById("dropBox");

/* file select */
fileInput.addEventListener("change", function(){
  showPreview(this.files[0]);
});

/* drag over */
dropBox.addEventListener("dragover", function(e){
  e.preventDefault();
  dropBox.style.borderColor = "#ff2fa4";
});

/* drag leave */
dropBox.addEventListener("dragleave", function(){
  dropBox.style.borderColor = "#d600c9";
});

/* drop */
dropBox.addEventListener("drop", function(e){
  e.preventDefault();
  dropBox.style.borderColor = "#d600c9";

  const file = e.dataTransfer.files[0];
  if(file && file.type.startsWith("image/")){
    showPreview(file);
  }
});

/* preview function */
function showPreview(file){
  const reader = new FileReader();
  reader.onload = function(e){
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
  }
  reader.readAsDataURL(file);
}
