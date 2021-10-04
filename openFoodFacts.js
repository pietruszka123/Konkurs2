const https = require('https')
var http = require('http');
const config = require("./config.json");

module.exports.getProduct = async function getProduct(productCode) {
    return new Promise((resolve, reject) => {
    var options = {
        host: 'world.openfoodfacts.org',
        path: `/api/${config['api-version']}/product/${productCode}.json`
      };
      
      var req = http.get(options, function(res) {
        if(res.statusCode != 200)resolve(JSON.stringify({status:0,status_verbose:"server Error",code:productCode}))
        var bodyChunks = [];
        res.on('data', function(chunk) {
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks);
          resolve(body)
        })
      });
      
      req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        reject(e)
      });
    })
}

//getProduct('5449000000996');