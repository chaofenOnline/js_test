function htmlspecialchars (str) {
 var str = str.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, '&quot;');
 return str;
}
htmlspecialchars('&jfkds<>'); // "&amp;jfkds&lt;&gt;"
