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
    var startTime = 0;
    return function() {
        var currTime = +new Date();
        
        if (currTime - statrTime > delay) {
            action.apply(this, arguments);
            statTime = currTime ;
        }
    }
}

// 操作函数
function method(){
	console.log(1)
}

window.onscroll = throttle(method,500)
