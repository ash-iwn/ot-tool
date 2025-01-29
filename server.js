// fileName : server.js 
// Example using the http module
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

const router = express.Router();

const pageUrl = "https://www.microfocus.com/fr-fr/products?trial=true";


/*
Product Name
Starting Letter
Description
Free Trial URL
Support Link URL
Community Link URL
*/

const webscraping = async pageUrl => {
    const browser = await puppeteer.launch({ args: ["--no-sandbox --window-size=${options.width},${options.height}"]});
    const page = await browser.newPage();

    let dataObj = {};
    try {
        await page.goto(pageUrl,
            {waitUntil : "domcontentloaded"}
        );

        await page.waitForFunction( () => document.querySelectorAll('a.block-header').length
        );

        await page.waitForFunction( () => document.querySelectorAll('button[class="contactIcon"] > img').length
        );

        const productsGrid = await page.evaluate(() => {
            const productListDom = document.querySelectorAll(".uk-card-body"); // getting all product divs 
           
            let productObj = [];
            productListDom.forEach(element => {

                const title = element.querySelector(".title").innerText; // getting Title of product
                let linkUrl = element.querySelector("a").getAttribute('href'); // getting community link url
                
                if(linkUrl && !linkUrl.startsWith("https")) {
                    linkUrl = 'https://www.microfocus.com/' + linkUrl; // adds microfocus url for relative paths
                }
                let description = element.querySelector(".description").innerText; // getting description
                let urlButtonsDom = element.querySelectorAll(".cta-section > div > .cta-buttons"); // gets dom of demo/free trial buttons div

                let itemObj = {

                };
                         
                itemObj = {
                    "Starting Letter" : title.substring(0,1),
                    "Product Name" :  title ,
                    "Community Link Url" : linkUrl,
                    "Description": description,
                };

                urlButtonsDom.forEach(button => {

                    // If trial Url or Demo Url exists add the respective link 
                    if(button.innerText.includes('Get free trial') &&  !button.innerText.includes('Request a demo')) {
                        itemObj['Trial Url'] = button.querySelector('a').getAttribute('href');
                        itemObj['Demo Url'] = ''
                    } else if (!button.innerText.includes('Get free trial') && button.innerText.includes('Request a demo')) {
                        itemObj['Trial Url'] = "";
                        itemObj['Demo Url'] = button.querySelector('a').getAttribute('href');
                    } else {
                        itemObj['Trial Url'] = button.querySelector('a:nth-child(1)').getAttribute('href');
                        itemObj['Demo Url'] = button.querySelector('a:nth-child(2)').getAttribute('href');
                    }


                    // same as linkUrl, add base url for relative paths
                    if(itemObj['Trial Url'] && !itemObj['Trial Url'].startsWith("https")) { 
                        itemObj['Trial Url'] = 'https://www.microfocus.com/' + itemObj['Trial Url'];
                    }
                    if(itemObj['Demo Url'] && !itemObj['Demo Url'].startsWith("https")) {
                        itemObj['Demo Url'] = 'https://www.microfocus.com/' + itemObj['Demo Url'];
                    }
                });

                // get button from contactLinkbutton
                let contactLinkDom = element.querySelector('button[class="contactIcon"] > img'); 
                itemObj['Support Link URL'] = contactLinkDom ? ( contactLinkDom.getAttribute('href') ? contactLinkDom.getAttribute('href') : "" ) : "";


                // add item object to list
                productObj.push(itemObj);
                
            });

            console.log(productListDom);

            return productObj;
        });

        dataObj = productsGrid;
    }
    catch(e) {
        console.log(e);
    }

    console.log(dataObj);

    browser.close();
}

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});



app.use((req, res, next) => {
    console.log('Time: ', Date.now());
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/getData', router.get('/', async (req, res, next) => {
    let data = await webscraping(pageUrl);
    res.json(data);
    next();
 }));


const port = process.env.PORT || 3200; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

