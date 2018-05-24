function CodingMan(name){
　　return new _codingMan(name);
}

function _codingMan(name) {
　　this.task=[];
　　var that=this;
　　var fn=(function(name){
　　　　return function(){
　　　　　　console.log("Hello I'm "+name);
　　　　　　that.next();
　　　　}
　　})(name);

　　this.task.push(fn);

　　setTimeout(function(){that.next()},0)
}


_codingMan.prototype={
　　constructor:_codingMan,

　　next:function(){
　　　　var fn=this.task.shift();
　　　　fn&&fn();
　　},


　　sleep:function(time){
　　　　var that=this;
　　　　var fn=(function(time){
　　　　　　return function(){
　　　　　　　　console.log("sleep......."+time);
　　　　　　　　setTimeout(function(){
　　　　　　　　　　that.next();
　　　　　　　　},time*1000)
　　　　　　}
　　　　})(time);
　　　　this.task.push(fn);

　　　　return this;
　　},

　　sleepfirst:function(time){
　　　　var that=this;
　　　　var fn=(function(time){
　　　　　　return function(){
　　　　　　　　console.log("sleep......."+time);
　　　　　　　　setTimeout(function(){
　　　　　　　　　　that.next();
　　　　　　　　　　},time*1000)
　　　　　　　　}
　　　　　　})(time);
　　　　this.task.unshift(fn);
　　　　return this;
　　},

　　eat:function(something){
　　　　var that=this;
　　　　var fn=(function(something){
　　　　　　　　return function(){
　　　　　　　　console.log("Eat "+something);
　　　　　　　　that.next();
　　　　　　　　}
　　　　　　})(something)
　　　　　　this.task.push(fn);
　　　　　　return this;
　　　　}
　　}
CodingMan("Joe").sleepfirst(5).eat("supper")
