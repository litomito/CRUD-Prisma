const selFileTxt = document.getElementById("selected-file-text");
const fileInput = document.getElementById("file");
const btn = document.querySelector(".btn");

const displayFileName = (input, initialFileName) => {
    const fileName = input.files.length > 0 ? input.files[0].name : initialFileName;
    selFileTxt.textContent = fileName;
};

fileInput.onchange = function (e) {
    e.preventDefault();

    const file = fileInput.files && fileInput.files[0];

    if (file) {
        const img = new Image();
        img.src = window.URL.createObjectURL(file);

        img.onload = function () {
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            window.URL.revokeObjectURL(img.src);

            if (width < 1280 && height < 854) {
                displayFileName(fileInput, initialImageName);
            } else {
                alert("Only images with dimensions 1280x854 and under are allowed.");
            }
        };
    }
};




function deleteUser(userId) {
    fetch(`/users/delete/${userId}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = "/read";
    })
    .catch(error => {
        console.error("Error deleting user:", error);
    });
}

btn.addEventListener("click", () => {
    const userId = btn.getAttribute("data-user-id");

    if (btn) {
        const result = window.confirm("Are you sure you want to delete this user?");
        if (result == true) {
            deleteUser(userId);
        } else {
            return false;
        }
    }
});