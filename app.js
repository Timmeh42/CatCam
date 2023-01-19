const outputWidth = 80;
const outputHeight = 60;

let oldImageBytes;

const videoElement = document.createElement('video');
document.body.append(videoElement);

const downscaledCanvasElement = document.createElement('canvas');
downscaledCanvasElement.width = outputWidth;
downscaledCanvasElement.height = outputHeight;
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
        canvasContext.filter = 'grayscale()';
        canvasContext.drawImage(videoElement, 0, 0, outputWidth, outputHeight);
        const newImageData = canvasContext.getImageData(0, 0, outputWidth, outputHeight);
        const newImageBytes = newImageData.data;
        const filteredImageData = canvasContext.createImageData(newImageData);
        const filteredImageBytes = filteredImageData.data;
        let countMovingPixels = 0;
        if (oldImageBytes) {
            for (let n = 0; n < newImageBytes.length / 4; n++) {
                const newPixel = newImageBytes[n * 4];
                const oldPixel = oldImageBytes[n * 4];
                const motionDetected = Math.abs(oldPixel - newPixel) > 20;
                countMovingPixels += motionDetected;
                const filteredPixel = 255 * motionDetected;
                filteredImageBytes[n * 4] = filteredPixel;
                filteredImageBytes[n * 4 + 1] = filteredPixel;
                filteredImageBytes[n * 4 + 2] = filteredPixel;
                filteredImageBytes[n * 4 + 3] = 255;
            }
        }
        oldImageBytes = newImageBytes;
        if (countMovingPixels > 100) {
            console.log('motion detected!')
        }
    }, 1000 / 9);
})