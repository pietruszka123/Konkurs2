//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const express = require("express");
const https = require("https")
const config = require("./config.json")
var router = express.Router()
var path = require("path");


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

const openfoodfacts = require("./openFoodFacts");

var head =
{
    'Content-Type': 'application/json',
    'X-Powered-By': config["x-Powered-By"]
}

var app = express();

app.use(express.json())
const PORT = process.env.PORT || 8080;

var server = app.listen(PORT, function () {
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
function isMobile(req, res, next) {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
            req.headers["user-agent"]
        )
    ) {
        // Instead of redirecting to another view you can also render a separate
        // view for mobile view e.g. res.render('mobileview');

        res.redirect("/mobile/");
    } else {
        next();
    }
}
app.use("/", function (req, res, next) {
    if (req.originalUrl == "/") isMobile(req, res, next)
    else {
        next()
    }

});
app.get("/mobile", function (req, res, next) {
    res.sendFile('public/index.html', { root: __dirname })
})
app.use("/", express.static('public'));
router.get("/", (req, res, next) => {
    console.log("a")
    console.log(res)
    next()
})

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


function GetProductPage(req, res, con, mobile = false) {
    return new Promise((resolve, rejects) => {
        var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + req.params.productID;
        if (req.params.productID.match(/^[0-9]+$/) != null) {
            con.query(sql, (err, result, f) => {
                if (err) {
                    res.send("DataBaseError")
                    return
                }
                console.log(req.params)
                res.statusCode = 200
                if (mobile) var file = fs.readFileSync("./public/mobile/index.html")
                else var file = fs.readFileSync("./public/index.html")

                var files = file.toString('utf8');
                if (result && result.length) {
                    files = files.replace(`<meta name="productData" content="null">`, `<meta name="productData" content='${JSON.stringify(result)}'><meta name="productID" content=${req.params.productID}>`)
                    //file = files.replace(`<title>EcoHelper</title>`,`<title>EcoHelper-${}</title>`)
                }
                //res.sendFile('public/index.html', {root: __dirname })
                res.send(files)
            })
        } else {
            if (mobile) res.sendFile('public/index.html', { root: __dirname })
            else res.sendFile('public/index.html', { root: __dirname })

        }
    })
}

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
        console.log(req)
        console.log(req.body)
        if (req.body && req.body.productCode) {
            if (req.body.productCode.match(/^[0-9]+$/) != null) {
                var kodKreskowy = parseInt(req.body.productCode)
                var sql = "SELECT * FROM ecohelper WHERE codeProduct = " + kodKreskowy;
                con.query(sql, function (erroro, result, fields) {
                    console.log(result)
                    if (erroro) {
                        console.log(erroro)
                        res.writeHead(412, head)
                        res.end(JSON.stringify({ status: 0, error: "server error" }))
                        return
                    };
                    if (!result[0]) {
                        res.writeHead(404, head)
                        res.end(JSON.stringify({ status: 0, error: "Product not found" }))
                        sql = `INSERT INTO ecohelper (codeProduct, co2Cost, comments, betterAlternative, other) VALUES
                        ("${kodKreskowy}", 0, '{\"comments\":[]}','\{"alternatives\":[]\}', NULL);`
                        con.query(sql, (err, resu, f) => {
                            console.log(err)
                            console.log(resu)
                        })
                        return
                    } else {
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
        if (req.body && req.body.commentPoints && req.body.productCode) {
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
          ${req.body.commentPoints})
      WHERE
        ecohelper.codeProduct = ${req.body.productCode};`
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({status: 0, error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.post("/addAlternative.json", (req, res, next) => {
        if (req.body && req.body.alternativeContent && req.body.alternativeImage && req.body.productCode && req.body.id) {
            var sql = `UPDATE ecohelper SET betterAlternative = JSON_ARRAY_APPEND(betterAlternative,'$.alternatives',JSON_OBJECT("alternativeContent","${req.body.alternativeContent}","alternativeImage","${req.body.alternativeImage}","alternativePoints","${0}","id","${req.body.id}")) WHERE codeProduct = ${req.body.productCode}`
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({status: 0, error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.post("/updateAlternative.json", (req, res, next) => {
        if (req.body && req.body.alternativePoints && req.body.productCode) {
            var sql = `UPDATE ecohelper
            INNER JOIN JSON_TABLE(
              ecohelper.betterAlternative,
              '$.alternatives[*]' COLUMNS(
                rowid FOR ORDINALITY,
                id INT PATH '$.id'
              )
            ) der ON der.id = 0
          SET ecohelper.betterAlternative =
            JSON_REPLACE(
              ecohelper.betterAlternative,
              CONCAT('$.alternatives[', der.rowid - 1, '].alternativePoints'),
              ${req.body.alternativePoints})
          WHERE
            ecohelper.codeProduct = ${req.body.productCode};`
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({status: 0, error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.post("/addComment.json", (req, res, next) => {
        if (req.body && req.body.comment && req.body.productCode && req.body.id) {
            console.log("add")
            //var commentObject = {"commentContent": req.body.comment,"commentPoints": 0}
            var sql = `UPDATE ecohelper SET comments = JSON_ARRAY_APPEND(comments,'$.comments',JSON_OBJECT("commentContent","${req.body.comment}","commentPoints","${0}","id","${req.body.id}")) WHERE codeProduct = ${req.body.productCode}`
            con.query(sql, (err, result, f) => {
                if (err) {
                    console.log(err)
                    res.writeHead(404, head)
                    res.end(JSON.stringify({status: 0, error: "Error?" }))
                    return
                }
                console.log(result)
                res.writeHead(200, head)
                res.end(JSON.stringify({ "status": 1 }))
            })
        }
    })
    app.get("/product/:productID", (req, res, next) => {
        GetProductPage(req, res, con)
    })
    app.get("/mobile/product/:productID", (req, res, next) => {
        GetProductPage(req, res, con, true)
    })
})
//#endregion