Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#yourElement'), // Or '#yourElement' (optional)
        constraints: {
            width: 200,
            height: 200,
            facingMode: "environment",
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
    Quagga.onProcessed((e) => {
        if (e != null) {
            console.log(e)
        }

    })
});