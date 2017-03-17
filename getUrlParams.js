获取 url 中的参数
1. 指定参数名称，返回该参数的值 或者 空字符串
2. 不指定参数名称，返回全部的参数对象 或者 {}
3. 如果存在多个同名参数，则返回数组 
输入例子:
getUrlParam('http://www.nowcoder.com?key=1&key=2&key=3&test=4#hehe', 'key')

输出例子:
[1, 2, 3]


function getUrlParam(sUrl, sKey) {
    var paramsObj = {};
    sUrl.replace(/(?=\??)(\w+)=(\w+)/g,function($0,$1,$2){
        paramsObj[$1] = paramsObj[$1] ? [].concat(paramsObj[$1],$2) : $2;
	})
    return sKey ? paramsObj[sKey] || '' : paramsObj;
}
