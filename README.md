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
#### ten plik został stworzony przez ...
