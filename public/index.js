document.addEventListener("DOMContentLoaded", function(){
    var product = document.head.querySelector("[name~=productData][content]").content;
    if(product != "null"){
        try {
            var comments = JSON.parse(product)
            console.log(comments[0])
            updateInfo(comments[0].codeProduct,false)
            setComments(JSON.parse(comments[0].comments));
        } catch (error) {
            console.error(error)
        }
    }
});
function setComments(r){
    var comments = r.comments;
    var commentContainer = document.getElementsByClassName("zbiorKomentarzy")[0]
    if(addCommentObj == undefined)addCommentObj = commentContainer.childNodes[1];
    comments.sort((a, b) => {
        return a.commentPoints - b.commentPoints;
    });
    comments.reverse()
    commentContainer.innerHTML = "";
    commentContainer.append(addCommentObj)
    for (let i = 0; i < comments.length; i++) {
        console.log(i)
        
        console.log(comments[i])
        var a = `<div class="komentarz">
    <div class="miejsce ${(i < 3) ? `m${i+1}` : ""}"><p>#${i+1}</p></div>
    <div class="wiadomosc">${comments[i].commentContent}<p></p></div>
</div>`
    commentContainer.insertAdjacentHTML('beforeend',a)
    }
}
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
    return new Promise((resolve, reject) => {
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
var addCommentObj;
function updateInfo(tosend,comm) {
    sendGetProduct(tosend).then((r) => {
        if (!r.product) return
        history.pushState('witaj jeśli widzisz tą wiadomosc to cos', 'EcoHelper', `/product/${tosend}`);
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
    if(comm){
    sendGetFromDataBase(tosend).then((r) => {
        setComments(JSON.parse(r[0].comments))
    })
    }
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