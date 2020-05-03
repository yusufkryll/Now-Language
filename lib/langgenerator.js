/* jshint esversion: 8 */
const fs = require('fs');
const Lang = function() {
  this.ins = {
    end: ';',
    string: '\'',
  };
  this.strs = {
    if: 'if',
    function: 'fn',
    end: '$',
  };
  this.start = (run) =>{
    let code = '';
    if (process.argv[2]!=null) {
      fs.readFile(process.argv[2], (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        code = data.toString();
        const out = run(code);
        if (process.argv[3]=='--getjsandrun') {
          fs.writeFile(process.argv[2]
			  .replace('.now', '') + ".js", out,
          function(err) {
            if (err) throw err;
            eval(out);
					  });
        } else if (process.argv[3]=='--getjs') {
          fs.writeFile(process.argv[2].replace('.now', '') + ".js", out,
			   function(err) {
            if (err) throw err;
					  });
        } else {
          eval(out);
        }
      });
    } else {
      fs.writeFile("index.js"
			  .replace('.now', '') + '.' + ".js", out,
          function(err) {
            if (err) throw err;
            eval(out);
					  });
    }
  };
  let infun = false;
  let instr = false;
  this.part = (code) => {
    const result = [];
    const csplit = code.split('');
    let opn = 0;
    let cls = 0;
    for (elm in csplit) {
      if (csplit[elm] == ';' && !infun && !instr) {
        var until = csplit.slice(0, parseInt(elm));
        var devam = csplit.slice(parseInt(elm)+1);
        result.push(until.join(''));
        result.push(this.part(devam.join(''), ()=>{}));
        var merged = result.flat(Infinity);
        return merged;
      }
      if (csplit[elm] == '{' && !instr) {
        infun = true;
        opn++;
      }
      if (csplit[elm] == '"') {
        instr = !instr;
      }
      if (csplit[elm] == '}' && !instr) {
        cls++;
        if (opn==cls) {
          var until = csplit.slice(0, parseInt(elm));
          var devam = csplit.slice(parseInt(elm)+1);
          result.push(until.join('').replace(/{/, ''));
          infun = false;
          result.push(this.part(devam.join('')));
          var merged = result.flat(Infinity);
          return merged;
        }
      }
    }
    return '';
  };
  this.analysis = (code, fn) => {
    let codesplitbyspaces = code.replace(/\#\*[\s\S]*?\*\#|\#.*/g, '');
    codesplitbyspaces = codesplitbyspaces
        .replace(/(\r\n|\n|\r)/gm, '')
        .splitEx(' {}');
    const conlysp = code.replace(/(\r\n|\n|\r)/gm, '').splitEx(' ');
    for (ch in codesplitbyspaces) {
      const a = {
        word: codesplitbyspaces[ch],
        number: parseInt(ch),
        words: codesplitbyspaces,
        words1: conlysp,
        getafterto: function(arg1, arg2) {
          const after = this.words.slice(arg1);
          let result = '';
          for (elm in after) {
            if (elm == after.lastIndexOf(arg2)) return result;
            result+=after[elm];
          }
        },
        getaftertof: function(arg1, arg2) {
          const after = this.words.slice(arg1);
          let result = '';
          for (elm in after) {
            if (elm == after.indexOf(arg2)) return result;
            result+=after[elm];
          }
        },
        getafter: function(arg1) {
          const after = this.words.slice(arg1);
          let result = '';
          for (elm in after) {
            result+=after[elm];
          }
          return result;
        },
      };
      fn(a);
    }
  };
};

String.prototype.splitEx = function(delimiters) {
  const parts = [];
  let current = '';
  for (let i = 0; i < this.length; i++) {
    if (delimiters.indexOf(this[i]) < 0) current += this[i];
    else {
      parts.push(current);
      current = this[i];
    }
  }
  parts.push(current);
  return parts;
};

exports.Lang = Lang;
