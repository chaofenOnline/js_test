// 简易防抖
function debounce(fn,delay){
	var timer = null;
 	return function(){
     	var me = this,args = arguments;
     	clearTimeout(timer);
     	timer = setTimeout(function(){
         	fn.apply(me,args);
     	},delay);
    }
}

// 操作函数
function method(){
	console.log(1)
}

window.onscroll = debounce(method,500)

// 简易节流
function throttle(fn,delay){
	var timer,
		start = new Date();
 	return function(){
		var now = new Date(), me = this, args = arguments;
		clearTimeout(timer);
		if(now - start >= delay){
			fn.apply(me,args);
			start = now;
		}else{
			timer = setTimeout(fn,delay)
		}
    }
}

// 操作函数
function method(){
	console.log(1)
}

window.onscroll = throttle(method,500)
