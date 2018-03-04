const http = require('http');
const superagent = require('superagent');
const cheerio = require('cheerio');
const hostname = '127.0.0.1';
const port = 9000;

http.createServer((req, res) => {
var url_info = require('url').parse(req.url, true);

//检查是不是给/test的request
// console.log(url_info.pathname);
res.writeHead(200, {"Content-Type": "application/json"});
if(url_info.pathname === '/api/radio'){

 superagent
   .get('https://www.sanwen.net/')
   .then(function(sres) {
    // console.log(sres.text)
    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#main .member a').each(function (idx, element) {
        var $elementI = $(element).find('img');
        var $elementP = $(element).find('p');
        items.push({
          "href": $elementI.attr('src'),
            "text":$elementP.text()
        });
      })
      res.end(JSON.stringify(items));
   })
   .catch(function(err) {
        console.log("superagent"+err)
   });
}else if(url_info.pathname === '/api/home'){

 superagent
   .get('http://www.sanwen.com/')
   .then(function(sres) {
    // console.log(sres.text)
    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items1 = [],items2=[];
      $('.index-row .hot-news .hot-news-list').each(function (idx, element) {
        var $elementA = $(element).find('a');
        var $elementP = $(element).find('p');
        items1.push({
            "title": $elementA.attr('title'),
            "text":$elementP.text()
        });
      })
    $('.index-row .row-right-box .author-list li').each(function (idx, element) {
        var $elementA = $(element).find('a');
        var $elementI = $(element).find('img');
        items2.push({
            "src": $elementI.attr('src'),
            "authorName":$elementA.text()
        });
      })
      res.end(JSON.stringify({
          items1,items2
      }));
   })
   .catch(function(err) {
        console.log("superagent"+err)
   });




}





}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});