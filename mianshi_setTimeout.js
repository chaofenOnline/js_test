function fn(){
	var len = 4;
	while(len--){
		setTimeout(function(){
			console.log(len);
		})
		console.log(len);
	}
}
 
// 输出 3210 -1-1-1-1
// 闭包改良
function fn(){
	var len = 4;
	while(len--){
        (function(l){
          setTimeout(function(){
            console.log(l);
          })
        })(len)
		
		console.log(len);
	}
}

// 输出 3210 3210   
理解： 定时器是异步，进入循环后首次输出已经是递减后的len，当len==0时不再进入循环，
此时调起定时器线程，执行4次输出，由于每次都用闭包将变量保存起来，因此可以正常输出len值
