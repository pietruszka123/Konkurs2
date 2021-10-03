const puppeteer = require('puppeteer');

module.exports.getProduct = async function getProduct(productCode) {
    url = 'https://world.openfoodfacts.org/product/' + productCode;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    var out = []

    const [productName] = await page.$x('/html/body/div/div/div/div[2]/div[4]/h1');
    if (productName == undefined) {
        console.log('Informacje o opakowaniu są niedostępne, możesz dodać je tutaj: ' + url);
    } else {
        const txtPName = await productName.getProperty('textContent');
        const rawTxtPName = await txtPName.jsonValue();
        out.push({rawTxtPName});
    }

    const [productSrc] = await page.$x('//*[@id="og_image"]');
    if (productSrc == undefined) {
        console.log('Zdjęcie produktu jest niedostępne, możesz dodać je tutaj: ' + url);
    } else {
        const src = await productSrc.getProperty('src');
        const srcTxt = await src.jsonValue();
        out.push({srcTxt});
    }
    
    const [productPackaging] = await page.$x('//*[@id="field_packaging_value"]');
    if (productPackaging == undefined) {
        console.log('Informacje o opakowaniu produktu są niedostępne, możesz dodać je tutaj: ' + url);
    } else {
        const txtPackaging = await productPackaging.getProperty('textContent');
        const rawTxtPackaging = await txtPackaging.jsonValue();
        out.push({rawTxtPackaging});
    }

    browser.close();
    return out
}

//getProduct('5449000000996');