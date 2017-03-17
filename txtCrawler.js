var http=require('http');
var fs=require('fs');
var cheerio=require('cheerio');
var request=require('request');
var url='http://novel.hongxiu.com/a/1030665/11851997.html';
var i=0;
function dist(x){
	// 如果目录data不存在则创建
	fs.exists("./data/",function(exists){
		if (!exists) {
			fs.mkdir("./data/",function(err){
				if (err) {
					return console.error(err);
				}
				console.log("目录创建成功。");
			});
		}
	});
	go(x)
}
function go(x){
	http.get(x,function(res){
		var html='';
		res.setEncoding('utf-8');
		res.on('data',function(data){
			html+=data;
		})
		res.on('end',function(){
			var $=cheerio.load(html);
			var title=$('#htmltimu').text();
			var caption=$('.contentbox').find('p').text();
			var novels={
				title:title,
				caption:caption
			}
			savedContent($,novels);
			i++;
			var nexlink='http://novel.hongxiu.com'+$('#htmlxiazhang').attr('href');
			if(i<500){
				dist(nexlink)
			}
		})
	}).on('error',function(err){
		if(err){
			console.log(err);
		}
	})
}
function savedContent($, novels) {
	fs.appendFile('./data/' + novels.title + '.txt', novels.caption, 'utf-8', function (err) {
		if (err) {
			console.log(err);
		}
	});

}
dist(url)
