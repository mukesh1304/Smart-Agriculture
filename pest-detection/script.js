const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const resultMessage = document.getElementById('resultMessage');
const suggestions = document.getElementById('suggestions');

// ✅ Preview Image on Upload
imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.innerHTML = `<img src="${reader.result}" alt="Uploaded Image" />`;
        };
        reader.readAsDataURL(file);
    }
});

// ✅ Submit Form and Detect
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = imageUpload.files[0];
    if (!file) {
        alert('Please upload an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Simulate API Call
        const response = await fetch('http://localhost:8080/api/detect-pest', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            resultMessage.textContent = `✅ Detected: ${data.pest}`;
            resultMessage.style.color = 'green';
            suggestions.innerHTML = `<p><strong>Suggestion:</strong> ${data.suggestion}</p>`;
        } else {
            resultMessage.textContent = '❌ No pests or diseases detected.';
            resultMessage.style.color = 'red';
            suggestions.innerHTML = '';
        }
    } catch (error) {
        console.error('Detection failed:', error);
        resultMessage.textContent = '⚠️ Error during detection.';
        resultMessage.style.color = 'red';
    }
});

// ✅ Logout Function
function dashboard() {
    window.location.href = '../dashboard.html';
}
