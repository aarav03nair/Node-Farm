const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//FILES
// //clocking sync way
// const textIn= fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);

// const textOut=`this is what we know about the avocado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);

// //non-blocking async way
// fs.readFile('./txt/start.txt','utf-8', (err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err,data2)=>{
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8', (err,data3)=>{
//             console.log(data3);

//             fs.writeFile('./txt/final.txt',`${data2} \n${data3}`,'utf-8',(err)=>{
//                 console.log("your file has been written")
//             })
//         })
//     })
// })
///////////////////////////////////////////

//SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
console.log(slugify('Fresh Avocado', { lower: true }));

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHTML = dataObject
      .map((el) => replaceTemplate(templateCard, el))
      .join('');
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    //console.log(cardsHTML)

    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObject[query.id];
    console.log(product);
    const output = replaceTemplate(templateProduct, product);

    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  //ERROR NOT FOUND
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>this page cannot be found.</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
