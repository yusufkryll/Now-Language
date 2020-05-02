/*jshint esversion: 6 */

var lang = require("./langgenerator.js").lang;
const fs = require('fs');
var nowlang = new lang();
var out = "";
nowlang.start((code)=>{
    out = partcode(code);
    return out;
});

function partcode(code){
    var results = "";
    var parted = nowlang.part(code);
    Array.from(parted).forEach(element => {
        results+=compile(element); 
    });
    return results;
}
function compile(code) {
    var result = "";
    var first = true;
    nowlang.analysis(code,pack => {
        if(first){
            first = false;
            var _strt = "";
            var _end = "";
            var looptime = pack.words.join("").trim().split(/([)])/).pop().split("::")[1];
            if(pack.words.join("").split("(")[0].trim() != "if" && pack.words.join("").split("(")[0].trim() != "layer" && pack.words.join("").split("(")[0].trim() != "loop" && !pack.words.join("").startsWith("else") && pack.words.join("").split("(")[0].trim() != "else if" && pack.words.join("").split("(")[0].trim() != "while" && pack.words.join("").split("(")[0].trim() != "for"){
                if(looptime != undefined){
                    pack.words[pack.words.length-1] = pack.words.join("").trim().split(":").slice(0,1).join("");
                    if(looptime.substring(0,1)==">"){
                        looptime = looptime.substring(1);
                        _strt = `for(freeloop=0;freeloop<${looptime};freeloop++){`;
                    }else{
                        _strt = `for(freeloop=${looptime};freeloop>0;freeloop--){`;
                    }
                    _end = `}`;
                }
            }
            if(pack.words.join("").trim().split(" ")[0] == "var"){
                let all = pack.words.join("");
                all = all.replace("<<" , "{");
                all = all.replace(">>" , "}");
                result += _strt + all + ";\n";
                
            }
            else if(pack.words[0] == "#"){
            }
            else if(pack.words[0] == "return"){
                result += "return" + pack.words.slice(1).join("") + ";\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "delay"){
                let body = pack.words.join("").split("(").slice(1); 
                body[0] = "(" + body[0];
                result += _strt + "await new Promise(resolve => setTimeout(resolve, " + body.join("") + "));\n" + _end;
            }
            else if(pack.words.join("").split("(")[0].trim() == "onJS"){
                let body = pack.words.join("").split(/([(])/).slice(1);
                body[0] = body[0];
                result += _strt + body.join("").substring(2, body.join("").length-2); + "\n" + _end; // jshint ignore:line
            }
            else if(pack.words[0] == "add"){
                result += partcode(fs.readFileSync(pack.words.slice(1).join("").split("\"").join("").trim()).toString());
            }
            else if(pack.words[0] == "fn"){
                var name = pack.words.slice(1).join("").split("(")[0].trim();
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                args = args[0] + args[1];
                if(args == undefined) args = "";
                if(name == undefined) name = "";
                result += "function " + name + args + "\n" +
                 "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "layer"){
                
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                args = args[0] + args[1];
                if(args == undefined) args = "";
                result += "(" + args.replace(/([)(])/g,"") + "()=>{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "\n})();\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "loop"){
                result += "setInterval(() => \n" + "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "},1);\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "if"){
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                args = args[0] + args[1];
                if(args == undefined) args = "";
                result += "if" + args + "\n" +
                "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "else if"){
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                args = args[0] + args[1];
                if(args == undefined) args = "";
                result += "else if" + args + "\n" +
                "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else if(pack.words.join("").startsWith("else")){
                    result += "else" + "\n" +
                    "{\n" + partcode(pack.words.join("").trim().substring(4)) + "}\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "while"){
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                args = args[0] + args[1];
                if(args == undefined) args = "";
                result += "while" + args + "\n" +
                "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else if(pack.words.join("").split("(")[0].trim() == "for"){
                let args = pack.words.join("").split(/([(])/).slice(1).join("").split(/([)])/);
                if(!args[0].includes("in")) args[0]+=";i>=0;i--";
                args = args[0] + args[1];
                if(args == undefined) args = "";
                result += "for" + args + "\n" +
                "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else if(pack.words[0].trim() == "$"){
                let args = pack.words[1];
                if(args == undefined) args = "";
                result += "if(" + pack.words.slice(1).join("").split(/([)])/)[0] + pack.words.join("").split(/([)])/)[1] + ")\n" +
                 "{\n" + partcode(pack.words.join("").split(/([)])/).slice(2).join("")) + "}\n";
            }
            else{
                var ops = ["=", "!", ">", "<","-","+"];
                let all = pack.words.join("");
                all = all.replace("<<" , "{");
                all = all.replace(">>" , "}");
                var sp = pack.words.join("").split(/([(])/);
                let body = sp.slice(1);
                if(ops.some(el => pack.words.join("").includes(el))) {
                    all = all.replace(".=","="+pack.words[0].split(".")[0]+".");
                    result += _strt + all  + _end + ";\n";
                }
                else if(pack.words.join("") != "") 
                {
                    result += _strt + sp[0] + body.join("") + ";\n" + _end;
                }
            }
        }
    });
    return result;
}