const recordBtn = document.getElementById('record-btn');
const micIcon = document.getElementById('mic-icon');
const fileUpload = document.getElementById('file-upload');
const fileInfo = document.getElementById('file-info');
const predictBtn = document.getElementById('predict-btn');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const results = document.getElementById('results');

// State to track whether we are recording
let isRecording = false;
let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener('click', () => {
    if (isRecording) {
        // Stop recording
        mediaRecorder.stop();
        recordBtn.classList.remove('recording');
        micIcon.src = 'microphone-icon.png';  // Reset the icon
    } else {
        // Start recording
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audioChunks = [];  // Clear the chunks
                    // Show the file info
                    fileInfo.textContent = 'Audio Recorded';
                    // You can now send the audio for prediction
                };

                recordBtn.classList.add('recording');
                micIcon.src = 'stop-icon.png';  // Change to a stop icon
            })
            .catch(err => {
                alert('Error accessing microphone: ' + err);
            });
    }
    
    isRecording = !isRecording;
});

predictBtn.addEventListener('click', () => {
    if (!fileUpload.files.length && !audioChunks.length) {
        alert('Please upload or record an audio file first.');
        return;
    }

    // Simulate prediction process
    progressBarContainer.style.display = 'block';
    progressBarFill.style.width = '0%';
    results.style.display = 'none';

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBarFill.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            progressBarContainer.style.display = 'none';
            results.style.display = 'block';

            // Simulated results
            document.getElementById('predicted-name').textContent = 'Sample User';
            document.getElementById('predicted-age').textContent = '25';
            document.getElementById('predicted-gender').textContent = 'Male';
            document.getElementById('reduction-accuracy').textContent = '95%';
            document.getElementById('rmse-value').textContent = '0.02';
        }
    }, 300);
});
