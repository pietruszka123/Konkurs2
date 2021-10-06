process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

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
            res.end(ret)
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




function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "`": '&grave'
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}


kodKreskowy = 0;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const { response } = require("express");
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecohelper"
});

con.connect(function (erroro) {
    if (erroro) throw erroro;
wynik = {};

app.post('/', urlencodedParser, function (req, res) {
    kodKreskowy = (sanitize(req.body.kodProduktu));

    sql = "SELECT * FROM ecohelper WHERE codeProduct = " + kodKreskowy;
    
    
        con.query(sql, function (erroro, result, fields) {
            if (erroro) throw erroro;
            sql = "";
            wynik = result;
            console.log(result[0].codeProduct);
            sendDataToClient();
        });
    })

    console.log(kodKreskowy);

});
function sendDataToClient(){
app.get('/info', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(wynik); //replace with your data here
});}

app.listen(3000);
