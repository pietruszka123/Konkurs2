
const express = require("express");

const openfoodfacts = require("./openFoodFacts")
const config = require("./config.json")

var head =
{
    'Content-Type': 'application/json',
    'X-Powered-By': config["x-Powered-By"]
}

var app = express();

app.use(express.json())


var server = app.listen(8080, function () {
    console.log("Dziala")
    let body = [];

})
app.use("/", express.static('public'));



app.post("/getProduct.json", (req, res, next) => {
    if (req.body && req.body.productCode) {
        openfoodfacts.getProduct(req.body.productCode).then((ret) => {
            res.writeHead(200, head
            )
            res.end(JSON.stringify(ret))
            next()
        })
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Powered-By': config["x-Powered-By"]
        })
        res.end("no product code in Request")
        next()
    }
})
