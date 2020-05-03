/* jshint esversion: 8 */
const fs = require("fs");
if (process.argv[2]=="init") {
init();
}
init();

function init() {
    fs.readFile(__dirname + "/initsite.html", (errs, data) =>{
        fs.writeFile("index.html", data , function(err) {
            if(err) throw err;
        })
    });
    if (!fs.existsSync("js")){
        fs.mkdirSync("js");
    }
    fs.readFile(__dirname + "/nowscript.js", (errs, data) =>{
        fs.writeFile("js/nowscript.js", data , function(err) {
            if(err) throw err;
        })
    });
    fs.readFile(__dirname + "/generator.js", (errs, data) =>{
        fs.writeFile("js/generator.js", data , function(err) {
            if(err) throw err;
        })
    });
}