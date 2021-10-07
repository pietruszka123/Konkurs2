function sendGetProduct(toSend) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/getProduct.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //if(!xhr.response.product)return;
                console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify({ productCode: toSend }));
    })
}
function sendGetFromDataBase(toSend) {
    return new Promise((resolve,reject)=>{
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/getProductB.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //if(!xhr.response.product)return;
                console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify({ productCode: toSend }));
    })
}
function updateInfo(tosend) {
    sendGetProduct(tosend).then((r) => {
        if (!r.product) return
        var product = r.product
        console.log(r)
        var a = `<h3>Nazwa produktu:</h3>
        <p> ${product.product_name}</p>
        <h3>Opakowanie:</h3>
        <p> ${product.packaging}</p>
        <h3>Info:</h3>
        <p> Pewnie się zastanawiacie co mogłoby się stać jak wstawimy więcej informacji... no ja też więc piszę jakiś dłuższy tekst bo nie będę się szmacił lorem ipsum.</p>
        <h3>Dalsze:</h3>
        <p> </p>`
        document.getElementsByClassName("tekstInf")[0].innerHTML = a
    })
    sendGetFromDataBase(tosend).then((r)=>{
        var a = `<div class="komentarz">
        <div class="miejsce m1"><p>#1</p></div>
        <div class="wiadomosc">Trzeba wywalić do kosza. Nie umiesz zrobić czegoś tak banalnego? Czemu? Gdzie ja żyje? Jaki to świat? Przez kogo jestem zdominowany?...<p></p></div>
    </div>`
    })
}
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#yourElement'), // Or '#yourElement' (optional)
        constraints: {
            width: 400,
            height: 400,
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
    })*/
    Quagga.onProcessed((e) => {
        if (e != null) {
            if (e.codeResult) {
                updateInfo(e.codeResult.code)
                Quagga.stop();
            }
            console.log(e);


        }

    })

});
document.getElementById("przycisk").addEventListener("click", getProduct)
function getProduct(e) {
    updateInfo(document.getElementById("inputText").value)
}