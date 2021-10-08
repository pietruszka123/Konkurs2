document.addEventListener("DOMContentLoaded", function () {
    window.commentsLength = 0
    window.commentsMax = 0
    var product = document.head.querySelector("[name~=productData][content]").content;
    var productID = document.head.querySelector("[name~=productID][content]");
    //console.log(product)
    if (productID) {
        window.productCode = productID.content
    }
    if (product != "null") {
        try {
            var comments = JSON.parse(product)
            //console.log(comments)
            //console.log(comments[0])
            updateAlternatives(JSON.parse(comments[0].betterAlternative))
            updateInfo(comments[0].codeProduct, false)
            setComments(JSON.parse(comments[0].comments));
            document.getElementById("co2").innerText = comments[0].co2Cost 
        } catch (error) {
            //console.error(error)
        }
    } else {
        noComents();
    }
    initSendComment();
});
/**
 * 
 * @param {Element} addto 
 * @param {object} alt 
 */
function addAlternative(addto,alt){
    var a = `<div class="zamiennik">
    <img src="${alt.alternativeImage}"
        alt="image of ${alt.alternativeContent}">
    <p>${alt.alternativeContent}</p>
</div>`
    addto.insertAdjacentHTML('beforeend', a)
}
function updateAlternatives(alt){
    console.log(alt)
    var alt = alt.alternatives
    var altCon = document.getElementsByClassName("zamienniki")[0]
    altCon.innerHTML = ""
    for (let i = 0; i < alt.length; i++) {
        console.log(i)
        addAlternative(altCon,alt[i])
    }
}
/**
 * 
 * @param {Element} addto 
 * @param {Element} commentObj 
 * @param {number} i 
 * @param {boolean} after 
 */
function addComment(addto, commentObj, i, focus = false) {
    if (window.commentsLength == 0) {
        commentContainer.innerHTML = "";
        //commentContainer.append(addCommentObj)
        after = false
    }
    var a = `<div class="komentarz">
    <div class="ocenianieKomentarzy">
        <button class="updoot" id="u${commentObj.id}">
            <h2>V</h2>
        </button>
        <p id="${commentObj.id}">${commentObj.commentPoints}</p>
        <button class="downdoot" id="d${commentObj.id}">
            <h2>V</h2>
        </button>
    </div>
    <div class="miejsce ${(i < 3) ? `m${i + 1}` : ""}">
        <p>#${i + 1}</p>
    </div>
    <div class="wiadomosc">
        <p>${commentObj.commentContent}</p>
    </div>
</div>`
    addto.insertAdjacentHTML('beforeend', a)
    document.getElementById(`u${commentObj.id}`).addEventListener("click",(e)=>{
        var  text =document.getElementById(commentObj.id)
        sendUpdateComment({productCode:window.productCode,commentPoints:parseInt(text.innerText)+1}).then((r)=>{         
            text.innerText = parseInt(text.innerText)+1
        })

    })
    document.getElementById(`d${commentObj.id}`).addEventListener("click",(e)=>{
        var  text =document.getElementById(commentObj.id)
        sendUpdateComment({productCode:window.productCode,commentPoints:parseInt(text.innerText)-1}).then((r)=>{         
            text.innerText = parseInt(text.innerText)-1
        })
    })
    if (focus) addto.lastChild.scrollIntoView()

}
/**
 * 
 * @param {object} r 
 */
function setComments(r) {
    var comments = r.comments;
    window.commentsLength = comments.length
    var commentContainer = document.getElementsByClassName("zbiorKomentarzy")[0]
    comments.sort((a, b) => {
        return a.commentPoints - b.commentPoints;
    });
    comments.reverse()
    commentContainer.innerHTML = "";
    //commentContainer.append(addCommentObj)
    for (let i = 0; i < comments.length; i++) {
        //console.log(i)
        if (comments[i].id && parseInt(comments[i].id) > window.commentsMax) {
            window.commentsMax = comments[i].id
        }
        //console.log(comments[i])
        addComment(commentContainer, comments[i], i)
    }
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
function sendUpdateComment(tosend){
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/updateComment.json", true);
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
/**
 * 
 * @param {unknown} toSend 
 * @returns {object}
 */
function sendNewComment(tosend) {
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
function noComents() {
    var commentContainer = document.getElementsByClassName("zbiorKomentarzy")[0]
    //if(addCommentObj == undefined)addCommentObj = commentContainer.childNodes[1];
    commentContainer.innerHTML = ""
    var text = document.createElement("h3")
    text.style = "font-family: 'Source Sans Pro', sans-serif;"
    if (window.productCode) {
        text.textContent = "Brak Komentarzy"
    }
    else {
        text.textContent = "Tutaj pojawią się komentarze"
    }
    commentContainer.append(text)
}
//#endregion
var addCommentObj;
function updateInfo(tosend, comm) {
    sendGetProduct(tosend).then((r) => {
        if (!r.product) return
        history.pushState('witaj jeśli widzisz tą wiadomosc to cos', 'EcoHelper', `/product/${tosend}`);
        window.productCode = tosend;
        var product = r.product
        //console.log(r)
        var a = `<h3>Produkt:</h3>
        <p>${product.product_name}</p>
        <h3>Opakowanie:</h3>
        <p>${product.packaging}</p>
        <h3>Koszt CO<sub>2</sub>:</h3>
        <p id="co2">${document.getElementById("co2").innerText}</p>`
        document.getElementsByClassName("tekstInf")[0].innerHTML = a
        document.getElementsByClassName("zdjecie")[0].innerHTML = `<img src="${product.image_url}" alt="${product.product_name}">`
    })
    if (comm) {
        sendGetFromDataBase(tosend).then((r) => {
            console.log(r)
            if (r.comments){
                setComments(JSON.parse(r.comments))
                document.getElementById("co2").innerText = r.co2Cost
                updateAlternatives(JSON.parse(r.betterAlternative))
            }
            else {
                noComents()
            }
        })
    }
}
Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#kamerka'), // Or '#yourElement' (optional)
        constraints: {
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
                updateInfo(e.codeResult.code,true)
                Quagga.stop();
            }
            //console.log(e);


        }

    })

});
//#region Events
document.getElementById("przycisk").addEventListener("click", getProduct)
function initSendComment() {
    document.getElementById("komentarzSubmit").addEventListener("click", (e) => {
        console.log("click")
        var text = document.getElementById("komentarzInput").value
        text.trim()
        if (!e.target.wait) e.target.wait = false
        if (text.length != 0 && window.productCode && !e.target.wait) {
            e.target.wait = true
            document.getElementById("komentarzInput").value = ""
            sendNewComment({ productCode: window.productCode, comment: text, id: window.commentsMax + 1 }).then((r) => {
                addComment(document.getElementsByClassName("zbiorKomentarzy")[0], { "commentContent": text ,"commentPoints":0}, window.commentsLength, true)
                window.commentsLength++;
                window.commentsMax++;
                setTimeout(() => {
                    e.target.wait = false
                }, 5000)
            });
        } else {
            setTimeout(() => {
                document.getElementById("komentarzInput").placeholder = "poczekaj"
            }, 5000)
        }
    })
}
//#endregion
function getProduct(e) {
    updateInfo(document.getElementById("inputText").value, true)
}