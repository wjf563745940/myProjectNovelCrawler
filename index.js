// 引入依赖
var express = require('express');
var utility = require('utility');//工具类
var superagent=require('superagent')//http 库
 require('superagent-charset')(superagent);
var cheerio=require('cheerio');//类似jquery库
const rp = require('request-promise');
const async=require('async');//
const url=require('url');
var iconv = require("iconv-lite");//编码
var BufferHelper = require('bufferhelper');

// var mysql = require('mysql');
// var configmysql = require('./config-mysql');
// var pool  = mysql.createPool(configmysql);

// pool.getConnection(function(err, connection) {
//   // Use the connection
//   connection.query( 'SELECT something FROM sometable', function(err, rows) {
//     // And done with the connection.
//     connection.end();

//     // Don't use the connection here, it has been returned to the pool.
//   });
// });


// var asynctest=require('./asynctest')
const Novel=require('./app/modal/novel');
const NovelChapter=require('./app/modal/novelChapter');
const NovelContent=require('./app/modal/novelContent');
const Rule=require('./app/modal/rule');

// var novelContent = NovelContent.build({
//     'content': '丐世神医内容',
//     'novel_chapter_id':1
// });
// novelContent =  novelContent.save();
// console.log("novel get==",novel.get({'plain': true}))
// var novel2 = Novel.create({
//     'name': '操作db',
// });
// console.log(novel2.get({'plain': true}))
// 建立 express 实例
var app = express();
app.get('/createRule2',function(req,res,next){
  createRule();
  res.send("create rule")
})
app.get('/createRule',function(req,res,next){
    var novel = Novel.build({
    'name': '丐世神医',
    'rule':1,
    'url':"http://www.xxbiquge.com/4_4464/",
    'url_space':'4_4464/',
    'charset':'utf-8'
});
novel =  novel.save();
var novel = Novel.build({
    'name': '唐砖',
    'rule':1,
     'url':"http://www.xxbiquge.com/0_461/",
     'url_space':'0_461/',
     'charset':'utf-8'
});
novel =  novel.save();

})
app.get('/',function(req,res,next){

	res.send(JSON.stringify({name:'h y'}));
})
app.get('/addNovel',function(req,res,next){
  console.log(req.query.name)
var rq=getUrls("http://zhannei.baidu.com/cse/search?s=5199337987683747968&q="+encodeURI(req.query.name));
rq.then(function(data){

data= iconv.decode(data,"utf-8")
let $ = cheerio.load(data);
//console.log($(".result-list .result-item")[0])
var reslutDetial1=$(".result-list .result-item").eq(0).find(".result-game-item-detail");
if(reslutDetial1.find("a").attr("title")===req.query.name){
  let href=reslutDetial1.find("a").attr("href")
   res.send(JSON.stringify({errorCode:0,message:{name:req.query.name,href:href}}));
}else{
 res.send(JSON.stringify({errorCode:1,message:"未找到，请检查名字是否正确"}));
}

})
 //res.send(JSON.stringify({name:'h y'}));
})
app.get('/pcasync',function(req, res, next){
let bqg="http://www.xxbiquge.com";
var crawlerurl='http://www.xxbiquge.com/4_4464/';
var contenturlsel="#intro";
var urlssel="#list dl a";
var contentsel="#content";
console.log("req.query.id",req.query.id)
if(req.query){
  console.log(req.query.id)
     Novel.findById(req.query.id?req.query.id:1).then(function(noveldata){
          crawlerurl=noveldata.url;
          Rule.findById(noveldata.rule).then(function(data){
            bqg=data.main_space;
         contenturlsel=data.url_content_sel;
           urlssel= data.url_list_sel;
            contentsel=data.content_sel;
            if(data.is_add_spaceurl){
              bqg=data.main_space+noveldata.url_space;
            }
           crawler(req,res,next,bqg,crawlerurl,contenturlsel,urlssel ,contentsel,noveldata,data)
        })
        })
}else{
  crawler(req,res,next,bqg,crawlerurl,contenturlsel,urlssel,contentsel)
}
//console.info(req)

});
function crawler(req,res,next,bqg,crawlerurl,contenturlsel,urlssel ,contentsel,noveldata,ruledata){
     var prorq= getUrls(crawlerurl);
    //   superagent.get(crawlerurl)
    //   .charset('gbk')
    // .end(function (err, sres) {
    //   console.log(sres.text,"superagent")
    //   // 常规的错误处理
    //   if (err) {
    //     return next(err);
    //   }
    //   // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    //   // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    //   // 剩下就都是 jquery 的内容

    // });
  prorq.then(function(data){
     //data = iconv.encode(data, 'utf-8');
    //console.log("url data",noveldata)
    data= iconv.decode(data,noveldata.charset)
   // console.log("crawlerurl",data,+"crawlerurl");
    //res.send(data)
    let items = [],hrefs=[];
    let $ = cheerio.load(data);
    let content=$(contenturlsel).text();
    $(urlssel).each(function(inx,element){
      var $element=$(element);
      items.push({
        title:'',
        href:$element.attr('href'),
        name:$element.text()
      })
      
      hrefs.push(url.resolve(bqg,$element.attr('href')));
      
    })
    var novel = Novel.upsert({
    'id':noveldata.id,
    'allchapter': hrefs.length,
    "statusName":"已收录",
    "statusType":2,
    'chaptered': 0,
    });
//novel =  novel.save();
    var novelChapter;
    var hs=[];
    hrefs.forEach(function(item,i){
         // novelChapter= NovelChapter.build();
         hs.push({
            'name':items[i].name,
            'urlname':item,
            'novel_id':noveldata.id, 
             'next_chapter_id':i+2,
              'pre_chapter_id':i,
              'chapter_id':i+1,
               'content_id':1
        })
      })
    var novelChapter =  NovelChapter.bulkCreate(hs);
      //novelChapter =  novelChapter.save();
/*hrefs.splice(0,5)*/
console.log("hrefs lenght============",hrefs.length,hrefs[0])
var concurrencyCount=0
var allcount=0;
var contentDb=[];
    async.mapLimit(hrefs, 5, function (url, callback) {
      concurrencyCount++;
      //allcount++;
      //console.log("novelContent-------------------build","并发数",concurrencyCount,"")
     getUrls(url).then(function(data){
   //   console.log(data)

      data= iconv.decode(data,noveldata.charset)
      concurrencyCount--;
     // console.log(data)

      let $ = cheerio.load(data,{decodeEntities: false});

       let content= $(contentsel).html();
       if(content.length>25000){
        console.log(content.length+"长度=========");
       }
       contentDb.push({
         'content': content,
             'novel_chapter_id':++allcount,
             'novel_id':noveldata.id,

       })
       if(contentDb.length==100){
        console.log("个数超过100 字节超过 100*25000")
        var novelChapter =  NovelContent.bulkCreate(contentDb);
         var novelChapterlength=contentDb.length;
       Novel.findById(noveldata.id).then(function(data){
          //console.log("当前novel");
             // console.info(data);
           // console.log(noveldata)
               let novel = Novel.upsert({//更新进度
                'id':data.id,
                'chaptered': data.chaptered+novelChapterlength,
                });
        })
        
        contentDb=[];
       }
    //     var novelContent = NovelContent.build({
   //          'content': content,
   //          'novel_chapter_id':1
      // });
      //  novelContent= novelContent.save();
       callback(null,'');//回调
      //res.send(content);
     }).catch(function (err) {
       //err= iconv.decode(err,'GBK')
       console.log("err ----------------204");
       callback(null,'');//回调
    });
}, function (err, result) {
  console.log('final:---------------------------------------------------');
  var novelChapter =  NovelContent.bulkCreate(contentDb);
  var novelChapterlength=contentDb.length;
  Novel.findById(noveldata.id).then(function(data){
               let novel = Novel.upsert({
                'id':data.id,
                'chaptered': data.chaptered+novelChapterlength,
                });
        })
        contentDb=[];

});
res.send('success  hrefs length='+hrefs.length)
    //res.send(content);
  }).catch(function (err) {
       //err= iconv.decode(err,'GBK')
        //console.log(err.response);
      // console.log(err.response.body);
      console.log(err)
       console.log("err 223")
      // console.log(data)
       //callback(null,'');//回调

    });
}
function getUrls(url){
    //console.log("------geturl")
    var cnodeUrl = url;
    var options = {
    uri: cnodeUrl,
    encoding: null,
};
     var prorq=rp(options)
     return prorq;    
}
function createRule(){
  var hs=[];
  hs.push({
    "name":"rule1",
    "main_space":"http://www.xxbiquge.com/",
    "url_content_sel":"#intro",
    "url_list_sel":"#list dl a",
    "content_sel":"#content",
    "is_add_spaceurl":false,
  })
  hs.push({
    "name":"rule2",
    "main_space":"http://www.ybdu.com/",
    "url_content_sel":".mu_h1 h1",
    "url_list_sel":".mulu_list li a",
    "content_sel":"#htmlContent",
    "is_add_spaceurl":true
  })
  console.log("create rule")
  var rule =  Rule.bulkCreate(hs);
}


app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});