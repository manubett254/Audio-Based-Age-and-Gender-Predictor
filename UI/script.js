// Elements
const micBtn = document.getElementById("micBtn");
const fileInput = document.getElementById("fileInput");
const dragArea = document.getElementById("dragArea");
const predictBtn = document.getElementById("predictBtn");
const progressBar = document.getElementById("progressBar");
const predictionResult = document.getElementById("prediction");
const fileMessage = document.getElementById("fileMessage");

let audioBlob = null;
let recorder;
let audioChunks = [];

// Enable predict button when audio is ready
function enablePredictButton() {
    if (audioBlob) {
        predictBtn.disabled = false;
    } else {
        predictBtn.disabled = true;
    }
}

// Start recording when microphone button is clicked
micBtn.addEventListener("click", startRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder = new MediaRecorder(stream);
            recorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            recorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                enablePredictButton();
                fileMessage.textContent = "Recording completed!";
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
fileInput.addEventListener("change", handleFileInput);

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio")) {
        audioBlob = file;
        enablePredictButton();
        fileMessage.textContent = `Uploaded file: ${file.name}`;
    } else {
        alert("Please upload a valid audio file.");
    }
}

// Handle file drag and drop
dragArea.addEventListener("dragover", handleDragOver);
dragArea.addEventListener("drop", handleFileDrop);

function handleDragOver(event) {
    event.preventDefault();
    dragArea.classList.add("drag-over");
}

function handleFileDrop(event) {
    event.preventDefault();
    dragArea.classList.remove("drag-over");
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("audio")) {
        audioBlob = file;
        enablePredictButton();
        fileMessage.textContent = `Uploaded file: ${file.name}`;
    } else {
        alert("Please drop a valid audio file.");
    }
}

// Handle prediction button click
predictBtn.addEventListener("click", processAudio);

function processAudio() {
    updateProgressBar(0);

    // Simulate backend processing with a timeout
    setTimeout(() => {
        updateProgressBar(100);
        displayPrediction("Male Adult"); // Simulated prediction
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
