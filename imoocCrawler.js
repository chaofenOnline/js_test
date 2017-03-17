/**
 *  修改储存目录 /xxx/xxx/ (最后要加一个 '/' )
 */
var savePath = './video/';
/**
 * 自己在慕课网上登录后 获取cookies 并替换下面的cookie
 */
var cookie = 'lzstat_uv=11444353962768251863|3600220; imooc_uuid=1be5cf9a-6cfe-4c05-8a72-d65f3060a7ff; imooc_isnew_ct=1470201023; PHPSESSID=1jkh8aafn1pbuccdt0b6t7trt0; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1475900199,1476172354; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1476180697; cvde=57fc9a34b05c8-82; imooc_isnew=2; loginstate=1; apsid=M5YWEzNWVkMzIyMjViM2NhZTY1NzZmZjA4MjFmOGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTA3OTM2NgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADhmZjk1NzMyYmQ4NmFjZjJiZjM0NGYwZWExNGVjNTZi2rr8V9q6%2FFc%3DZj';

var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');

var courseTitle = ''; // 存储当前课程名称
var courseTotalCount = 0; // 正在下载的视频序号
var finishCount = 0;// 已下载的视频数量
var initConCount = 4; // 设置默认并发数量
var conCurrentCount = 0; // 当前并发数量

// 设置请求头信息
var headers = {
    "Cache-Control": "max-age=0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Referer": "http://www.imooc.com/",
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "zh-CN,zh;q=0.8",
    "Cookie": cookie
};

superagent
    .get('www.imooc.com/learn/441')
    .set(headers)
    .end(function(err, res) {
        // 解析获取到的dom
        var $ = cheerio.load(res.text);
        $('.course-infos .hd').find('h2').each(function(item) {
            // 获取当前课程名称
            courseTitle = $(this).text();
        })

        // 用于存储并发的请求内容
        var arr = [];
        $('.chapter').each(function(item) {
            // 获取所有视频相关id 名称等
            var videos = $(this).find('.video').children('li')
            videos.each(function(item) {
                var video = $(this).find('a');
                var filename = video.text().replace(/(^\s+)|(\s+$)/g,"");
                var id = video.attr('href').split('video/')[1];
                var obj = {
                    id:id,
                    filename:filename
                }
                arr.push(obj);
            });

        });
        // 开启异步流程控制并发量
        async.mapLimit(arr,initConCount, function (item,callback) {
                var id = item.id,filename = item.filename;
                // 获取下载地址
                getVideoUrl(id, function(url) {
                    conCurrentCount ++; // 并发数递增
                    courseTotalCount ++; // 记录当前为第几个视频
                    // 开始下载
                    download(url, filename, function(_filename) {
                        finishCount ++; // 下载完成，已下载的视频数量递增
                        console.log('第 ' + finishCount + ' 个视频  ' + _filename + '  下载完成.');
                        conCurrentCount -- ;// 并发数递减
                        callback(null,id,url,filename); // 执行下一次请求
                    })
                })
            },
            // 所有流程结束回调
            function (err, result) {
                console.log('爬虫程序结束，共下载视频数量为：' + result.length);
            });
    });

// 根据课程ID获取对应的视频地址
var getVideoUrl = function(id, callback) {
    superagent.get('http://www.imooc.com/course/ajaxmediainfo/?mid=' + id + '&mode=flash')
        .end(function(err, res) {
            var url = JSON.parse(res.text);
            if(url.result == 0) {
                url = url.data.result.mpath[0]; // 获取到视频真正地址
                callback(url);
            }
        })
};

// 根据url下载对应的视频文件
var download = function(url, filename, callback) {
    filename = filename.replace(/\(.*\)/,'').trim() + '.mp4';
    var dirPath = savePath + courseTitle + '/';
    // 如果目录不存在则新建
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    console.log('当前并发量为：' + conCurrentCount + ' 开始下载第 ' + courseTotalCount + ' 个视频  ' + filename + '  地址: ' + url);
    var writeStream = fs.createWriteStream(dirPath + filename);
    writeStream.on('close', function() {
        callback(filename); // 下载完成回调函数
    })
    var req = superagent.get(url)
    req.pipe(writeStream);
};
