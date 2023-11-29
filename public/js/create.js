const selFileTxt = document.getElementById("selected-file-text");
const fileInput = document.getElementById("file");

const displayFileName = (input) => {
    if (input.files.length > 0) {
        selFileTxt.textContent = input.files[0].name;
    } else {
        selFileTxt.textContent = "No image chosen";
    }
};


fileInput .onchange = function(e) {
  e.preventDefault();

  var file = fileInput.files && fileInput.files[0];

  var img = new Image();
  img.src = window.URL.createObjectURL(file);

  img.onload = function() {
    var width = img.naturalWidth,
      height = img.naturalHeight;

    window.URL.revokeObjectURL(img.src);

    if (width < 1280 && height < 854) {
      displayFileName(fileInput)
    } else {
      fileInput.value = ""
      alert("only 1280x854 and under for images")
    }
  };
};