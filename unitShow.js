let Big = require("big.js")

function unitShow(str){
    var temp = str;
    str = new Big(str)
    str = str.toFixed(2)
    str = str.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    str = str.replace(/\..+/,"")

    str = str.split(",")
    var len = str.length
    // 千位以下
    if(len === 1){
        return temp
    }
    // 千位以上
    var UnitsArr = ["K", "M", "B", "T"];
    var unit = UnitsArr[len-2];
    var pre = str[0];
    var aft = str[1].substr(0,2);
    if(aft === "00"){
        aft = ""
    }else{
        aft = "."+aft;
    }
    return pre + aft + unit
}

console.log(unitShow("123")) // 123
console.log(unitShow("123.45")) // 123.45
console.log(unitShow("9000")) // 9K
console.log(unitShow("12345")) // 12.34K
console.log(unitShow("123456")) // 123.45K
console.log(unitShow("123456789.234")) // 123.45M


