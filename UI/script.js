// Elements
const micBtn = document.getElementById("micBtn");
const fileInput = document.getElementById("fileInput");
const dragArea = document.getElementById("dragArea");
const progressBar = document.getElementById("progressBar");
const predictionResult = document.getElementById("prediction");

// Microphone and File Upload Handling
micBtn.addEventListener("click", startRecording);
fileInput.addEventListener("change", handleFileInput);
dragArea.addEventListener("dragover", handleDragOver);
dragArea.addEventListener("drop", handleFileDrop);

let recorder;
let audioChunks = [];

// Start recording when microphone button is clicked
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                processAudio(audioBlob);
            };
            recorder.start();
            micBtn.textContent = "Stop Recording";
            micBtn.onclick = stopRecording;
        })
        .catch(err => {
            console.error("Error accessing microphone: ", err);
            alert("Please allow access to your microphone.");
        });
}

// Stop recording and trigger processing
function stopRecording() {
    recorder.stop();
    micBtn.textContent = "Recording Stopped";
    micBtn.onclick = startRecording;
}

// Handle .wav file input
function handleFileInput(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio")) {
        processAudio(file);
    } else {
        alert("Please upload a valid audio file.");
    }
}

// Handle file drag and drop
function handleDragOver(event) {
    event.preventDefault();
    dragArea.classList.add("drag-over");
}

function handleFileDrop(event) {
    event.preventDefault();
    dragArea.classList.remove("drag-over");
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("audio")) {
        processAudio(file);
    } else {
        alert("Please drop a valid audio file.");
    }
}

// Process audio and call the backend for prediction
function processAudio(audioBlob) {
    updateProgressBar(0);

    // Simulating backend processing with a timeout
    setTimeout(() => {
        updateProgressBar(100);
        displayPrediction("Male Adult"); // This would be replaced with actual prediction logic
    }, 3000);
}

// Update the progress bar
function updateProgressBar(value) {
    progressBar.value = value;
}

// Display the prediction result
function displayPrediction(prediction) {
    predictionResult.textContent = `Prediction is: ${prediction}`;
}
