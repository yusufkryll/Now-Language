# Now programming language
Website: nowlang.netlify.app

## How to run?
```nowlang [.now file] [optional arguments]```

Optional arguments:<br>
--tojs: convert to js file<br>
--tojsandrun: convert to js file and run

## Example code

```
#use add for import now file
add utils.now;
#variable
var number = 0;
var object = <<log:"hello world!",end:"end">>;
#layers
layer(async){
delay(1000);
#user statement
$ isZero(number){
console.log(object.log);
}
delay(2000);
console.log(object.end);
}

#function
fn isZero(arg){
if(arg==0){
return(true);
}
return(false);
}


```

## Document
```var variablename = variable:any``` : variable definition <br>
Example:
```
var hello = "hello world";
console.log(hello);
```
```if(var:bool){}``` : if condition <br>
Example:
```
var bool = true;
if(bool){
console.log("bool is true.");
}
```
```for(again:int){}``` : for loop <br>
Example:
```
for(i=10){
console.log(i);
}
```
```while(var:bool){}``` : while loop <br>
Example:
```
var a = true;
var s = "";
while(a){
s+="0";
if(s=="00000"){
a=false;
}
}
```
```delay(miliseconds:int)``` : wait for miliseconds. <br>
Note: delay must be in layer(async).<br>
Example:
```
layer(async){
console.log("Hello world.");
delay(1000);
console.log("Waited for 1000 miliseconds.");
for(i=10){
delay(100);
console.log("delay in for loop.");
}
}
```
```add path``` : import .now file <br>
Example:<br>
index.now
```
add utils.now;
for(game in games){
console.log(games[game]);
}
```
utils.now
```
var games = [
"pacman",
"tetris",
"Q*bert"
];
```

