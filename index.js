const express = require("express");
var app = express();
var server = app.listen(8080, function() {
    console.log("Dziala")
})
app.use("/", express.static('public'));