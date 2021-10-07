process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require("express");

const fs = require("fs")

const mysql = require('mysql');

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
            res.end(ret)
            next()
        })
    } else {
        res.writeHead(404, head)
        res.end(JSON.stringify({error: "no product code in Request"}))
        next()
    }
})
var stringToHTML = function (str) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};




var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecohelper"
});
con.connect(function (erroro) {
    if (erroro){
    console.error(erroro);
    return
    }

    app.post("/getProductB.json", (req, res, next) => {
        if (req.body && req.body.productCode) {
            if(req.body.productCode.match(/^[0-9]+$/) != null){
                var kodKreskowy = parseInt(req.body.productCode)
                var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + kodKreskowy;
                con.query(sql, function (erroro, result, fields) {
                    if (erroro){
                        console.log(erroro)
                        res.writeHead(412, head)
                        res.end(JSON.stringify({error: "server error"}))
                        return
                    };
                    if(!result[0]){
                        res.writeHead(404, head)
                        res.end(JSON.stringify({error: "Product not found"}))
                        return
                    }
                    console.log(result[0].codeProduct);
                    res.writeHead(200, head)
                    res.end(JSON.stringify(result))
                });
            }
        }else{
            res.writeHead(404, head)
            res.end(JSON.stringify({error: "no product code in Request"}))
            next()
        }
    })
    app.get("/product/:productID",(req,res,next)=>{
        var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + req.params.productID;
        if(req.params.productID.match(/^[0-9]+$/) != null){
        con.query(sql,(err,result,f)=>{
            if(err){
                res.send("DataBaseError")
                return
            }
            console.log(req.params)
            res.statusCode = 200
            var file = fs.readFileSync("./public/index.html")
            var files = file.toString('utf8');
            files = files.replace(`<meta name="productData" content="null">`,`<meta name="productData" content='${JSON.stringify(result)}'  >`)
            //res.sendFile('public/index.html', {root: __dirname })
            res.send(files)
        })
    }else{
        res.sendFile('public/index.html', {root: __dirname })
    }
    })
})