fn(1234) // "1,234"
fn(1234456.12) // "1,234,456.12"


function fn(str){
	var arr = str.toString().split('.'); // 切割成整数和小数
	var zs = arr[0],xs = arr[1] ? '.'+arr[1] : '';
	if(zs.length<=3)return str; 
	var zsArr = zs.split('').reverse();// 将整数部分反序转为数组
	var out = [];
	// 循环整数反序数组并且判断是3的倍数并且不是最后一位则加逗号
	for(var i in zsArr){
		out.push(zsArr[i]);
		if( (i+1) % 3 === 0 && i != arr.length-1){
			out.push(',');
		}
	}
	return out.reverse().join('') + xs; // 将反序数组再次反序回原顺序
	
}