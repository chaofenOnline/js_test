
var charset = require('superagent-charset'),
    superagent = charset(require('superagent')),
    request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    async = require('async'),
    dirname = './img/';

var id = 1;
var url = 'http://www.58pic.com/tuku/820/';
var parentNum = 0; // 父级链接数组默认从第一位开始
var pageSize = 10 ; // 需要获取的页数
var picMaxCount = 10; // 图片下载并发数
var currentCount = 0 ; // 当前图片下载并发数
var picFinishedCount = 0; // 已下载图片数量

// 获取图片父级链接(即获取当前页面共有链接数量)
var getParentLinks = function (url,id) {
    url = url + 'id-'+id+'.html';
    console.log('当前链接为 ' +url);
    superagent
    // 数据来源
        .get(url)
        .charset()
        .end(function (err,res) {
            var $ = cheerio.load(res.text);
            // 用于存储所有点击链接的集合
            var aHrefs = [];
            $('#listBox').find('.thumb-box').each(function () {
                var address = $(this).attr('href');
                // 获取到每一张图片的地址并且添加进图片集合
                aHrefs.push(address);
            });
            // 截取前10个链接
            //aHrefs.length = 10;
            return imgDownload(aHrefs,parentNum);
        });
}

// 获取图片资源
var imgDownload = function (parentLinks,parentNum) {
    console.log('当前链接为第 ' + Number(parentNum+1) +' 个。');
    var uri = parentLinks[parentNum]; // 从第一个链接开始
    superagent
    // 数据来源
        .get(uri)
        .charset()
        .end(function (err,res) {
            var $ = cheerio.load(res.text);
            // 存放所有图片地址
            var imgArrs = [];
            $('img').each(function () {
                if($(this).attr('src')){
                    var title = $(this).attr('title'); // 当前图片名称
                    var address = $(this).attr('src'); // 当前图片链接
                    var obj = {
                        title:title,
                        address:address
                    }
                    imgArrs.push(obj);
                }
            });
            // 每次请求5张图片
            async.mapLimit(imgArrs, picMaxCount,
                function (img, callback) {
                    currentCount ++ ; // 当前并发数递增
                    // 抓取图片资源
                    fetchImg(img, callback);
                },
                // 结束回调
                function (err, result) {
                    // 还未抓取当前页面所有链接
                    if(parentNum < parentLinks.length-1){
                        console.log('当前页面 '+uri+' 已抓取完毕，抓取到的数量为：' + result.length,' 继续抓取下一个页面 ');
                        parentNum ++ ;
                        imgDownload(parentLinks,parentNum);
                    }else{ // 已抓取完毕当前页面，继续抓取下一页
                        if(id <= pageSize){
                            console.log('当前页码为 ' + id +' ,继续抓取下一个页码');
                            id ++ ;
                            getParentLinks(url,id);
                        }else{
                            console.log('抓取完毕。');
                        }
                    }
                }
            );
        });
};

// 图片抓取函数
var fetchImg = function (img,callback) {

    console.log('当前并发数为：' +currentCount +' 当前图片地址为:' + img.address);
    var filename = img.address;
    // 截取图片名
    if(filename){
        filename =  filename.substr(filename.lastIndexOf('\/')+1); // 截取最后一个/之后的字符
        if(filename.indexOf('jpg')>=0){
            filename = filename + '.jpg'
        }else{
            filename = filename + '.png';
        }
    }
    // 设置图片存放路径
    var filepath = dirname + filename;

    // 判断存放目录是否已经存在，如无则创建
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname);
    }
    // 判断当前图片是否已经存在
    fs.exists(filepath, function (exists) {
        if(exists){
            console.log(filepath + ' 已存在，不重新下载');
            currentCount -- ;
            callback(null,'exists');
        }else{
            // 发送请求开始抓取图片资源
            request.head(img.address, function (err,res,body) {
                if(err) callback(null, err);
                request(img.address)
                    .on('error', function (err) {
                        console.log('err: ' + err);
                    })
                    // 输出流
                    .pipe(fs.createWriteStream(filepath))
                    // 成功回调
                    .on('close', function () {
                        picFinishedCount ++ ; // 已下载图片数量递增
                        console.log('已下载第  '+picFinishedCount +' 张图片，当前图片地址为：' + img.address);
                        currentCount -- ; // 当前并发数递减
                        callback(null,img);
                    })
            })
        }
    });
};

// 主程序
var start = function () {
    console.log('爬虫程序开始');
    getParentLinks(url,id); // 获取当前页面所有链接数
};

start();
