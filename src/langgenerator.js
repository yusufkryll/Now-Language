const fs = require('fs');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let lang = function(){
	this.compilelang = "js";
	this.ins = {
		end:";",
		string:"'",
	};
	this.strs = {
		if:"if",
		function:"fn",
		end:"$"
	};
	this.start = (run) =>{
		var code = "";
		if(process.argv[2]!=null){
			rl.close();
			fs.readFile(process.argv[2], (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				this.compilelang = "js";
				code = data.toString();
				var out = run(code);
				if(process.argv[3]=="--getjsandrun") {
					fs.writeFile(process.argv[2].replace(".now","") + '.' + this.compilelang, out, function (err) {
						if (err) throw err;
						eval(out);
					  }); 	
				}
				else if(process.argv[3]=="--getjs") {
					fs.writeFile(process.argv[2].replace(".now","") + '.' + this.compilelang, out, function (err) {
						if (err) throw err;
					  }); 	
				}
				else{
					eval(out);
				}
			});
		}else{
			function reed() {
				rl.question("> ", function(input) {
					var out = run(input);
					try {
						eval(out); 
					} catch (e) {
							console.log(e.message);
					}
					reed();
				});	
			}
			reed();
		}
	};
	var infun = false;
	var instr = false;
	//kodu parçalara ayırma
	this.part = (code) => {
		var result = [];
		var csplit = code.split("");
		var opn = 0;
		var cls = 0;
		for(elm in csplit){
			if(csplit[elm] == ";" && !infun && !instr){
				var until = csplit.slice(0,parseInt(elm));
				var devam = csplit.slice(parseInt(elm)+1);
				result.push(until.join(""));
				result.push(this.part(devam.join(""),()=>{}));
				var merged = result.flat(Infinity);
				return merged;
			}
			if(csplit[elm] == "{" && !instr){
				infun = true;
				opn++;
			}
			if(csplit[elm] == "\""){
				instr = !instr;
			}
			if(csplit[elm] == "}" && !instr){
				cls++;
				if(opn==cls){
					var until = csplit.slice(0,parseInt(elm));
					var devam = csplit.slice(parseInt(elm)+1);
					result.push(until.join("").replace(/{/,""));
					infun = false;
					result.push(this.part(devam.join("")));
					var merged = result.flat(Infinity);
					return merged;
				}
			}
		}
		return "";
	}
	this.analysis = (code,fn) => {
		let codesplitbyspaces = code.replace(/\#\*[\s\S]*?\*\#|\#.*/g, '');
		codesplitbyspaces = codesplitbyspaces.replace(/(\r\n|\n|\r)/gm, "").splitEx(" {}");
		let conlysp = code.replace(/(\r\n|\n|\r)/gm, "").splitEx(" ");
		for(x in codesplitbyspaces){
			// if(codesplitbyspaces[x] != " ") codesplitbyspaces[x]=codesplitbyspaces[x].trim();
		}
		for(ch in codesplitbyspaces){
			var a = {
				word:codesplitbyspaces[ch],
				number:parseInt(ch),
				words:codesplitbyspaces,
				words1:conlysp,
				getafterto:function(arg1,arg2) {
					var after = this.words.slice(arg1);
					var result = "";
					for(elm in after){
						if(elm == after.lastIndexOf(arg2)) return result;
						result+=after[elm];
					}
				},
				getaftertof:function(arg1,arg2) {
					var after = this.words.slice(arg1);
					var result = "";
					for(elm in after){
						if(elm == after.indexOf(arg2)) return result;
						result+=after[elm];
					}
				},
				getafter: function(arg1) {
					var after = this.words.slice(arg1);
					var result = "";
					for(elm in after){
						result+=after[elm];
					}
					return result;
				}
			};
			fn(a);
		}
	}
};

String.prototype.splitEx = function(delimiters) {
    var parts = [];
    var current = '';
    for (var i = 0; i < this.length; i++) {
        if (delimiters.indexOf(this[i]) < 0) current += this[i];
        else {
            parts.push(current);
            current = this[i];
        }
    }
    parts.push(current);
    return parts;
};

exports.lang = lang;