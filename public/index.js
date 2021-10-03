Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#yourElement'), // Or '#yourElement' (optional)
        constraints: {
            //width: 200,
            //height: 200,
            //facingMode: "environment",
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
}, function(err) {
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
    })*/
    Quagga.onProcessed((e) => {
        if (e != null) {
            if(e.codeResult){
                document.getElementById("output").innerHTML = JSON.stringify(e.codeResult.code);
                Quagga.stop();
            }
            console.log(e);

            
        }

    })

});