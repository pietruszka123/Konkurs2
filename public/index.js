function sendGetProduct(toSend) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/getProduct.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify({ productCode: toSend }));
    })
}
/*Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#yourElement'), // Or '#yourElement' (optional)
        constraints: {
            //width: 200,
            //height: 200,
            facingMode: "environment",
        },
    },
    decoder: {
        readers: ["upc_reader",
            "upc_e_reader", "ean_8_reader", "ean_reader", "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",

            "i2of5_reader",
            "2of5_reader",
            "code_93_reader", "code_128_reader"
        ]
    }
}, function (err) {
    if (err) {
        console.log(err);
        document.body.innerHTML = err
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
    /*Quagga.onDetected((e) => {
        if (e != null) {
            console.log(e)
            document.body.innerHTML = "tak"
        }
    })* /
    Quagga.onProcessed((e) => {
        if (e != null) {
            if (e.codeResult) {
                //document.getElementById("output").innerHTML = JSON.stringify(e.codeResult.code);
                Quagga.stop();
                sendGetProduct(e.codeResult.code).then((r)=>{
                    var info = document.getElementsByClassName("informacje")[0]
                    console.log(r)
                    if(r.status == 1){
                        info.innerHTML = `<p>Nazwa produktu: ${r.product.inputStreamproduct_name} ${r.product.brands}</p>
                        <p>Opakowanie: ${r.product.packaging}</p>
                        <p>Coś tam coś</p>
                        <p>I inne takie fajne informacje</p>`
                    }
                })
                
            }
            console.log(e);


        }

    })

});*/
let selectedDeviceId;
const codeReader = new ZXing.BrowserBarcodeReader()//new ZXing.BrowserQRCodeReader()
var canvas = document.getElementById("canvas")
var video = document.getElementById("video")

var ctx = canvas.getContext('2d');
//const hints = new Map();
const formats = [ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.QR_CODE, ZXing.BarcodeFormat.CODE_128];
//codeReader.hints =hints;
//hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
codeReader.listVideoInputDevices()
    .then((videoInputDevices) => {
        console.log(videoInputDevices)
        selectedDeviceId = videoInputDevices[0].deviceId;
    })
codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
    if (result) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        console.log(result)
        codeReader.stopContinuousDecode()
        sendGetProduct(result.text).then((r) => {
            console.log(r)
        })
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var x = result.resultPoints[0].x;
        var y = result.resultPoints[0].y;
        var x1 = result.resultPoints[1].x - x;
        var y1 = result.resultPoints[1].y - y;
        ctx.rect(x, y, x, y);
        ctx.stroke();
        video.pause()
        //document.getElementById('result').textContent = result.text
    }
    if (err && !(err instanceof ZXing.NotFoundException)) {
        console.error(err)
        //document.getElementById('result').textContent = err
    }
})
console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
document.getElementById("przycisk").addEventListener("click", getProduct)
function getProduct(e) {
    sendGetProduct(document.getElementById("inputText").value).then((r) => {
        console.log(r)
    })
}