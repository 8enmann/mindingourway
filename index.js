const puppeteer = require('puppeteer')
const fs = require('fs')

const URL = 'http://mindingourway.com/guilt/'
async function printPDF(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.content a'); // Select all links

        for (var element of elements){ // Loop through each proudct
            let title = element.innerText; // Select the title
            let href = element.href; // Select the price

            data.push({title, href}); // Push an object with the data onto our array
        }

        return data; // Return our data array
    });
    for (let i=0; i < result.length; i++) {
        await page.goto(result[i].href, {waitUntil: 'networkidle0'})
        await page.addStyleTag({ content: '.main-header,.main-nav,.site-footer,.post-footer { display: none}' })
        await page.pdf({ format: 'A4', path: `pdfs/${i}.pdf`})
        console.log('write', i)
        fs.writeFileSync(`html/${i}.html`, await page.content())
    }

    await browser.close();
}


printPDF(URL)
