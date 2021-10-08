document.addEventListener("DOMContentLoaded", function(){
    window.commentsLength = 0
    window.commentsMax = 0
    var product = document.head.querySelector("[name~=productData][content]").content;
    var productID = document.head.querySelector("[name~=productID][content]");
    //console.log(product)
    if(productID){
        window.productCode = productID.content
    }
    if(product != "null"){
        try {
            var comments = JSON.parse(product)
            //console.log(comments)
            //console.log(comments[0])
            updateInfo(comments[0].codeProduct,false)
            setComments(JSON.parse(comments[0].comments));
        } catch (error) {
            //console.error(error)
        }
    }
});
/**
 * 
 * @param {Element} addto 
 * @param {Element} commentObj 
 * @param {number} i 
 * @param {boolean} after 
 */
function addComment(addto,commentObj,i,after =false){
    var a = `<div class="komentarz">
    <div class="miejsce ${(i < 3) ? `m${i+1}` : ""}"><p>#${i+1}</p></div>
    <div class="wiadomosc">${commentObj.commentContent}<p></p></div>
</div>`
    addto.insertAdjacentHTML((after) ? 'afterbegin' : 'beforeend',a)
    if(after){
        //console.dir(addto)
        var temp = addto.childNodes[0]
        //console.log(temp)
        addto.childNodes[0].parentNode.insertBefore(addto.childNodes[1],addto.childNodes[0])
    }
}
/**
 * 
 * @param {object} r 
 */
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
        //console.log(i)
        if(comments[i].id && comments[i].id > window.commentsMax){
            window.commentsMax = comments[i].id
        }
        //console.log(comments[i])
        addComment(commentContainer,comments[i],i)
    }
    initSendComment()
}
//#region requests
/**
 * 
 * @param {unknown} toSend 
 * @returns {object}
 */
function sendGetProduct(toSend) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/getProduct.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //if(!xhr.response.product)return;
                //console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify({ productCode: toSend }));
    })
}
//#region requests
/**
 * 
 * @param {unknown} toSend 
 * @returns {object}
 */
function sendGetFromDataBase(toSend) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/getProductB.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //if(!xhr.response.product)return;
                //console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify({ productCode: toSend }));
    })
}
//#region requests
/**
 * 
 * @param {unknown} toSend 
 * @returns {object}
 */
function sendNewComment(tosend){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/addComment.json", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //if(!xhr.response.product)return;
                //console.log(JSON.parse(xhr.response))
                resolve(JSON.parse(xhr.response))
            }
        }
        xhr.send(JSON.stringify(tosend));
    })
}
//#endregion
var addCommentObj;
function updateInfo(tosend,comm) {
    sendGetProduct(tosend).then((r) => {
        if (!r.product) return
        history.pushState('witaj jeśli widzisz tą wiadomosc to cos', 'EcoHelper', `/product/${tosend}`);
        window.productCode = tosend;
        var product = r.product
        //console.log(r)
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
        console.log(r)
        setComments(JSON.parse(r.comments))
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
        //console.log(err);
        document.body.innerHTML = err
        return
    }
    //console.log("Initialization finished. Ready to start");
    Quagga.start();
    /*Quagga.onDetected((e) => {
        if (e != null) {
            //console.log(e)
            document.body.innerHTML = "tak"
        }
    })*/
    Quagga.onProcessed((e) => {
        if (e != null) {
            if (e.codeResult) {
                updateInfo(e.codeResult.code)
                Quagga.stop();
            }
            //console.log(e);


        }

    })

});
//#region Events
document.getElementById("przycisk").addEventListener("click", getProduct)
function initSendComment(){
document.getElementById("komentarzSubmit").addEventListener("click",(e)=>{
    //console.log("click")
    var text = document.getElementById("komentarzInput").value
    text.trim()
    if(!e.target.wait)e.target.wait = false
    if(text.length != 0 && window.productCode && !e.target.wait){
        e.target.wait = true
        document.getElementById("komentarzInput").value = ""
        sendNewComment({productCode: window.productCode,comment:text}).then((r)=>{
            addComment(document.getElementsByClassName("zbiorKomentarzy")[0],{"commentContent":text},-1,true)
            setTimeout(()=>{
                e.target.wait = false
            },5000)
        });
    }else{
        //cooldown
    }
})
}
//#endregion
function getProduct(e) {
    updateInfo(document.getElementById("inputText").value,true)
}