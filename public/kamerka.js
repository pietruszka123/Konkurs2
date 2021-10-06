/*
do usunięcia
*/
var t = document.createElement("video")
t.id = "video"
document.getElementsByClassName("kamerka")[0].append(t);
var video = t
function deviceCount() {
    return new Promise(function (resolve) {
        var videoInCount = []

        navigator.mediaDevices
            .enumerateDevices()
            .then(function (devices) {
                devices.forEach(function (device) {
                    if (device.kind === 'video') {
                        device.kind = 'videoinput';
                    }

                    if (device.kind === 'videoinput') {
                        videoInCount.push(device)
                        console.log('videocam: ' + device.label);
                        //console.log(device)
                    }
                });

                resolve(videoInCount);
            })
            .catch(function (err) {
                console.log(err.name + ': ' + err.message);
                resolve(0);
            });
    });
}
function initCameraStream(devices) {
    if (window.stream) {
        window.stream.getTracks().forEach(function (track) {
            console.log(track);
            track.stop();
        });
    }

    // we ask for a square resolution, it will cropped on top (landscape)
    // or cropped at the sides (landscape)
    var size = 1280;
    console.log(devices)
    var constraints = {
        audio: false,
        video: {
            width: { ideal: 420 },
            height: { ideal: 640 },
            //width: { min: 1024, ideal: window.innerWidth, max: 1920 },
            //height: { min: 776, ideal: window.innerHeight, max: 1080 },
            facingMode: "environment",
            deviceId:{exact: devices.length > 0 ? devices[0].deviceId : undefined}
        },
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);

    function handleSuccess(stream) {

        window.stream = stream; // make stream available to browser console
        video.srcObject = stream;

        //console.log(window.stream.getVideoTracks())
        const track = window.stream.getVideoTracks()[0];

        const settings = track.getSettings();
        str = JSON.stringify(settings, null, 4);
        console.log('settings ' + str);
    }

    function handleError(error) {
        console.error('getUserMedia() error: ', error);
    }
}
document.addEventListener('DOMContentLoaded', function (event) {
    return;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                stream.getTracks().forEach(function (track) {
                    console.log(track)
                    track.stop();
                });
                deviceCount().then(function (deviceCount) {
                    //amountOfCameras = deviceCount;

                    // init the UI and the camera stream
                    //initCameraUI();
                    initCameraStream(deviceCount);

                    video.srcObject = stream;
                });
            })
            .catch(function (err0r) {
                console.log(err0r)
                document.body.innerHTML = err0r;
            });
    } else {
        alert("?")
        console.log("??")
    }
})
