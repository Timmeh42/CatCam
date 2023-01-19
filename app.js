const outputWidth = 80;
const outputHeight = 60;


const videoElement = document.createElement('video');
document.body.append(videoElement);

const downscaledCanvasElement = document.createElement('canvas');
downscaledCanvasElement.width = outputWidth;
downscaledCanvasElement.height = outputHeight;
document.body.append(downscaledCanvasElement);

const canvasContext = downscaledCanvasElement.getContext('2d');

let videoSettings;

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 1) {
            console.error('Multiple video tracks found!');
        } else {
            videoSettings = videoTracks[0].getSettings();
        }
        videoElement.srcObject = stream;
        videoElement.play();
    })

videoElement.addEventListener('canplay', () => {
    setInterval(() => {
        canvasContext.drawImage(videoElement, 0, 0, outputWidth, outputHeight);
    }, 1000 / videoSettings.frameRate);
    
})