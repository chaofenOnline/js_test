function format1(x, y) {
 var z = {
   y: x.getFullYear(),
   M: x.getMonth() + 1,
   d: x.getDate(),
   h: x.getHours(),
   m: x.getMinutes(),
   s: x.getSeconds()
 };
 return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
   return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
 });
}
format1(new Date(), 'yy-M-d h:m:s'); // 17-10-14 22:14:41
 
