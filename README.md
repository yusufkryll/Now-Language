# Now programming language
Website: <br> https://nowlang.netlify.app <br>
Youtube: <br> https://youtu.be/b3pY4MgOiY4

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
```else{}``` : else <br>
Example:
```
var bool = false;
if(bool){
console.log("bool is true.");
}else{
console.log("bool is false.");
}
```
```else if(var:bool){}``` : else if <br>
Example:
```
var a = false;
var b = true;
if(a){
console.log("a");
}else if(b){
console.log("b");
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

```fn name(arguments){}``` : function definition <br>
Example:
```
writechars("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla semper porta commodo. Nunc ut neque dignissim, mattis nulla ut, dapibus neque.");
fn writechars (str) {
var chars = str.split("");
for(char in chars){
console.log(chars[char]);
} 
}
```
```$ name(arguments){}``` : statement definition <br>
Example:
```
var percent = 100/100;
$ full(percent){
    console.log("percent is full.");
}

fn full (arg) {
  if (arg==1) {
    return(true);
  }
  return(false);
}
```
```::> var:int``` : loop operator <br>
Example:
```
var a = "I love NowLang.".split("");
console.log(a[freeloop])::>a.length;
#*
results:
I

l
o
v
e

N
o
w
L
a
n
g
.
*#
```
```:: var:int``` : inverse loop operator <br>
Example:
```
var a = "I love NowLang.".split("");
console.log(a[freeloop])::a.length;
#*
results:
.
g
n
a
L
w
o
N

e
v
o
l

I
*#
```
```var:any .= var:any``` : it is equal to this property <br>
Example:
```
var a = "string";
a.=split(""); # a equal to [s, t, r, i, n, g]
console.log(a);
```
