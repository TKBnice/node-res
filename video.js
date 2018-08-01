let express = require('express');
let app = express();
let request = require('request');
let cheerio = require('cheerio');//实现类似JQ
const hostname = "127.0.0.1";
const port = 9001;
const URL = 'http://vip.80inx.cn/'
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/api/video', function(req, res){

    request(URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
              //返回的body为抓到的网页的html内容
            let $ = cheerio.load(body); //当前的$符相当于拿到了所有的body里面的选择器
            let container = $('.container .b-listtab-main'); //拿到导航栏的内容
            let moveList = $(container).find('.list');
            let items = [];
            moveList.each(function(i,ele){
                items.push({
                    title:$(ele).find('img').attr('alt'),
                    img:$(ele).find('img').attr('src')
                })
            })

             res.send({
                 success:true,
                 list:items,
                 total:moveList.length
                });

        }else{
           console.log(`Server running at http://${hostname}:${port}/`); 
        }
    })



});

app.listen(port,hostname,function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});