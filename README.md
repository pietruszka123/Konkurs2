# Konkurs2

## Test
[woda](http://localhost:8080/product/5901088009730)

## **jak uzyskać produkt z przeglądarki**
<!-- - javascript -->
```javascript
var xhr = new XMLHttpRequest();
xhr.open("POST", "/getProduct.json", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({productCode:"5449000000996"}));
```
#### Aby uruchomić aplikacje należy otworzyć folder z plikami w terminalu/konsoli i wpisać komende "node index.js"
