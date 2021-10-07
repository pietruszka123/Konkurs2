# Konkurs2

## **jak uzyskać produkt z przeglądarki**
<!-- - javascript -->
<!--function getAllFuncs(toCheck) {
    const props = [];
    let obj = toCheck;
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter((e, i, arr) => {
        if (e != arr[i + 1] && typeof toCheck[e] == 'function') return true;
    });
}
console.log(getAllFuncs(codeReader)) -->
```javascript
var xhr = new XMLHttpRequest();
xhr.open("POST", "/getProduct.json", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({productCode:"5449000000996"}));
```
#### ten plik został stworzony przez ...
