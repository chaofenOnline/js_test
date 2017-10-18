// 方法一
('000000' + Math.floor(Math.random() *  999999)).slice(-6);
// 方法二
Math.random().toString().slice(-6);
// 方法三
Math.random().toFixed(6).slice(-6);
// 方法四
'' + Math.floor(Math.random() * 999999);
