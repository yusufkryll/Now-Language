# How to run?
```nowlang [.now file] [extra arguments]```

Extra arguments:
--tojs: convert to js file
--tojsandrun: convert to js file and run

# Example syntax

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
