//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require("express");
const https = require("https")
const config = require("./config.json")

var fs = require('fs');
if (config.debugLog) {
    var util = require('util');
    var date = new Date();
    datevalues = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var log_file = fs.createWriteStream(__dirname + `/logs/${datevalues[0]}-${monthNames[datevalues[1]]}-${datevalues[2]}.log`, { flags: 'w' });
    var log_stdout = process.stdout;



    console.log = function (d) { //

        log_file.write(`[${datevalues[0]} ${monthNames[datevalues[1]]} ${datevalues[2]} ${datevalues[3]}:${datevalues[4]}:${datevalues[5]}] ${util.format(d)}\n`);
        log_stdout.write(util.format(d) + '\n');
    };
}
const mysql = require('mysql');

const openfoodfacts = require("./openFoodFacts")


var head =
{
    'Content-Type': 'application/json',
    'X-Powered-By': config["x-Powered-By"]
}

var app = express();

app.use(express.json())
var server = app.listen(8080, function () {
    console.log("Dziala")
})
/*var privateKey = fs.readFileSync('privatekey.pem');
var certificate = fs.readFileSync('certificate.pem');
var server = https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(config.port, function () {
    console.log("Dziala")

});*/
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
        res.end(JSON.stringify({ error: "no product code in Request" }))
        next()
    }
})




var con = mysql.createConnection({
    host: config["DataBase-host"],
    user: config["DataBase-user"],
    password: config["DataBase-password"],
    database: config["DataBase-database"],
    port: config["DataBase-port"]
});
//#region DataBase
con.connect(function (erroro) {
    if (erroro) {
        console.error(erroro);
        return
    }

    app.post("/getProductB.json", (req, res, next) => {
        if (req.body && req.body.productCode) {
            if (req.body.productCode.match(/^[0-9]+$/) != null) {
                var kodKreskowy = parseInt(req.body.productCode)
                var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + kodKreskowy;
                con.query(sql, function (erroro, result, fields) {
                    console.log(result)
                    if (erroro) {
                        console.log(erroro)
                        res.writeHead(412, head)
                        res.end(JSON.stringify({status:0, error: "server error" }))
                        return
                    };
                    if (!result[0]) {
                        res.writeHead(404, head)
                        res.end(JSON.stringify({status:0,  error: "Product not found"}))
                        //sql = ""
                        //con.query()
                        return 
                    }else{
                        //console.log(result[0].codeProduct);
                        res.writeHead(200, head)
                        result[0].status = 1
                        res.end(JSON.stringify(result[0]))
                    }
                });
            }
        } else {
            res.writeHead(404, head)
            res.end(JSON.stringify({ error: "no product code in Request" }))
            next()
        }
    })
    app.post("/updateComment.json", (req, res, next) => {
        if (req.body && req.body.comment && req.body.productCode) {
            var sql = `UPDATE ecohelper
        INNER JOIN JSON_TABLE(
          ecohelper.comments,
          '$.comments[*]' COLUMNS(
            rowid FOR ORDINALITY,
            id INT PATH '$.id'
          )
        ) der ON der.id = 0
      SET ecohelper.comments =
        JSON_REPLACE(
          ecohelper.comments,
          CONCAT('$.comments[', der.rowid - 1, '].commentPoints'),
          ${req.body.commentPoints + 1})
      WHERE
        ecohelper.codeProduct = ${req.body.productCode};`
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({ error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.post("/addComment.json", (req, res, next) => {
        if (req.body && req.body.comment && req.body.productCode) {
            console.log("add")
            //var commentObject = {"commentContent": req.body.comment,"commentPoints": 0}
            var sql = `UPDATE ecohelper SET comments = JSON_ARRAY_APPEND(comments,'$.comments',JSON_OBJECT("commentContent","${req.body.comment}","commentPoints","${0}","id","${req.body.id}")) WHERE codeProduct = ${req.body.productCode}`
            console.log(sql)
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({ error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.get("/product/:productID", (req, res, next) => {
        var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + req.params.productID;
        if (req.params.productID.match(/^[0-9]+$/) != null) {
            con.query(sql, (err, result, f) => {
                if (err) {
                    res.send("DataBaseError")
                    return
                }
                console.log(req.params)
                res.statusCode = 200
                var file = fs.readFileSync("./public/index.html")
                var files = file.toString('utf8');
                if (result && result.length) files = files.replace(`<meta name="productData" content="null">`, `<meta name="productData" content='${JSON.stringify(result)}'><meta name="productID" content=${req.params.productID}>`)
                //res.sendFile('public/index.html', {root: __dirname })
                res.send(files)
            })
        } else {
            res.sendFile('public/index.html', { root: __dirname })
        }
    })
})
//#endregion