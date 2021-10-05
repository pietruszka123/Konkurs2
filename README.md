# Konkurs2

## **jak uzyskać produkt z przeglądarki**
<!-- - javascript -->
```javascript
var xhr = new XMLHttpRequest();
xhr.open("POST", "/getProduct.json", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({productCode:"5449000000996"}));
```
#### ten plik został stworzony przez ...
