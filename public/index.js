console.log(Quagga)
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#yourElement'), // Or '#yourElement' (optional)
        constraints: {
            width: 100,
            height: 100,
            facingMode: "environment",
            deviceId: "7832475934759384534"
        },
    },
    decoder: {
        readers: ["code_128_reader"]
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});