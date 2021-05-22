
let videoElem = document.querySelector("#video-elem");
//let audioElem = document.querySelector("audio");
let capturebtn = document.querySelector(".capture-btn");
let videoRecorder = document.querySelector("#record-video");
let timingELem = document.querySelector("#timing");
let clearObj;
let recordState = false;

let constraints = {
    audio: true,
    video: true
}
let mediaRecorder;
let buffer = [];


navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (mediaStream) {
        videoElem.srcObject = mediaStream;
        // audioElem.srcObject = mediaStream;

        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.addEventListener("dataavailable", function (e) {
            buffer.push(e.data);
        })
        mediaRecorder.addEventListener("stop", function () {
            //mime type
            let blob = new Blob(buffer, { type: "video/mp4" }); //convert data to a blob
            const url = window.URL.createObjectURL(blob); //converting blob to a url
            //download btn
            let a = document.createElement("a");
            //download
            a.download = "file.mp4";
            a.href = url;
            a.click(); // on click, download the file using the url in anchor tag
            buffer = [];
        })
    })
    .catch(function (err) {
        console.log(err);
    });

videoRecorder.addEventListener("click", function () {
    if (!mediaRecorder) {
        console.log("Permissions denied");
    }
    else if (recordState == false) {
        mediaRecorder.start();
        //videoRecorder.innerHTML = "Recording...";
        recordState = true;
        videoRecorder.classList.add("record-animation");
        startCounting();
    }
    else {
        mediaRecorder.stop();
        //videoRecorder.innerHTML = "Record";
        recordState = false;
        videoRecorder.classList.remove("record-animation");
        stopCounting();
    }
})
capturebtn.addEventListener("click", function () {
    //create a canvas element equal to your video frame
    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;
    let tool = canvas.getContext("2d");
    capturebtn.classList.add("capture-animation");
    tool.drawImage(videoElem, 0, 0);
    //converting image to link
    let link = canvas.toDataURL();
    //downloading image
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = "file.png";
    anchor.click();
    anchor.remove();
    canvas.remove();
    setTimeout(function () {
        capturebtn.classList.remove("capture-animation");
    }, 1000)
})
function startCounting(){
    timingELem.classList.add("timing-active");
    let timeCount = 0;
    clearObj = setInterval(function () {
        let seconds = (timeCount % 60) < 10 ? `0${timeCount % 60}` : `${timeCount % 60}`;
        let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}` : `${Number.parseInt(timeCount / 60)}`;
        let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}` : `${Number.parseInt(timeCount / 3600)}`;
            timingELem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    }, 1000);
}
function stopCounting() {
    timingELem.classList.remove("timing-active");
    timingELem.innerText = "00: 00: 00";
    clearInterval(clearObj);
}