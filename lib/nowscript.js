/* jshint esversion: 8 */
if(typeof Lang === 'undefined'){
  Lang = require('./generator.js').Lang;
}
var fs;
try {
  fs = require("fs");
} catch (error) {
  
}
const Nowlang = new Lang();
let out = '';
let codeheader = "";
let codedown = "";
let inps = "";
let exitchecker = "process.exit();";
let _save = {};
Nowlang.start((code)=>{
  out = partcode(code);
  out = "let save = " + JSON.stringify(_save) + ";" + out;
  return out;
});
/**
 * @param {string} code - NowLang code.
 * @return {string} Parted NowLang code.
 */
function partcode(code) {
  inps = "";
  exitchecker = "process.exit();";
  let results = '';
  const parted = Nowlang.part(code);
  Array.from(parted).forEach((element) => {
    results+=compile(element);
  });
  return results + inps;
}
/**
 * @param {string} code - Parted NowLang code.
 * @return {string} NowLang to javascript code.
 */
function compile(code) {
  let result = '';
  let first = true;
  Nowlang.analysis(code, (pack) => {
    if (first) {
      first = false;
      let _strt = '';
      let _end = '';
      let looptime = pack.words.join('')
          .trim()
          .split(/([)])/)
          .pop()
          .split('::')[1];
      if (pack.words.join('').split('(')[0].trim() != 'if' &&
        pack.words.join('').split('(')[0].trim() != 'layer' &&
        pack.words.join('').split('(')[0].trim() != 'loop' &&
        !pack.words.join('').startsWith('else') &&
        pack.words.join('').split('(')[0].trim() != 'else if' &&
        pack.words.join('').split('(')[0].trim() != 'while' &&
        pack.words.join('').split('(')[0].trim() != 'for') {
        if (looptime != undefined) {
          pack.words[pack.words.length-1] = pack.words.join('')
              .trim()
              .split(':')
              .slice(0, 1)
              .join('');
          if (looptime.substring(0, 1)=='>') {
            looptime = looptime.substring(1);
            _strt = `for(freeloop=0;freeloop<${looptime};freeloop++){`;
          } else {
            _strt = `for(freeloop=${looptime};freeloop>0;freeloop--){`;
          }
          _end = `}`;
        }
      }
      if (pack.words[0] == '#') {
      } else if (pack.words[0] == 'return') {
        result += 'return' + pack.words.slice(1).join('') + ';\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'delay') {
        const body = pack.words.join('').split('(').slice(1);
        body[0] = '(' + body[0];
        result += _strt +
        'await new Promise(resolve => setTimeout(resolve, ' +
        body.join('') + '));\n' + _end;
      } else if (pack.words.join('').split('(')[0].trim() == 'onJS') {
        const body = pack.words.join('').split(/([(])/).slice(1);
        body[0] = body[0];
        result += _strt +
        body.join('').substring(2, body.join('').length-2); +
        '\n' + _end; // jshint ignore:line
      } else if (pack.words[0] == 'add') {
        result += partcode(
            fs.readFileSync(
                pack.words.slice(1)
                    .join('')
                    .split('"')
                    .join('')
                    .trim(),
            ).toString());
      } else if (pack.words[0] == 'fn') {
        let name = pack.words.slice(1).join('').split('(')[0].trim();
        let args = pack.words.join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        args = args[0] + args[1];
        if (args == undefined) args = '';
        if (name == undefined) name = '';
        result += 'function ' + name + args + '\n' +
                 '{\n' +
                 partcode(
                     pack.words
                         .join('')
                         .split(/([)])/)
                         .slice(2)
                         .join('')) +
                  '}\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'layer') {
        let args = pack.words
            .join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        args = args[0] + args[1];
        if (args == undefined) args = '';
        result += '(' + args.replace(/([)(])/g, '') +
        '()=>{\n' +
        partcode(
            pack.words
                .join('')
                .split(/([)])/)
                .slice(2)
                .join(''),
        ) + '\n})();\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'loop') {
        result += 'setInterval(() => \n' +
         '{\n' +
         partcode(
             pack.words
                 .join('')
                 .split(/([)])/)
                 .slice(2)
                 .join('')) +
           '},1);\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'if') {
        let args = pack.words
            .join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        args = args[0] + args[1];
        if (args == undefined) args = '';
        result += 'if' + args + '\n' +
                '{\n' + partcode(
            pack.words
                .join('')
                .split(/([)])/)
                .slice(2)
                .join(''),
        ) + '}\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'else if') {
        let args = pack.words
            .join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        args = args[0] + args[1];
        if (args == undefined) args = '';
        result += 'else if' + args + '\n' +
                '{\n' +
                partcode(
                    pack.words
                        .join('')
                        .split(/([)])/)
                        .slice(2)
                        .join(''),
                ) + '}\n';
      } else if (pack.words.join('').startsWith('else')) {
        result += 'else' + '\n' +
                    '{\n' +
                    partcode(
                        pack.words
                            .join('')
                            .trim()
                            .substring(4),
                    ) + '}\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'while') {
        let args = pack.words
            .join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        args = args[0] + args[1];
        if (args == undefined) args = '';
        result += 'while' + args + '\n' +
                '{\n' +
                partcode(
                    pack.words
                        .join('')
                        .split(/([)])/)
                        .slice(2)
                        .join('')) +
                   '}\n';
      } else if (pack.words.join('').split('(')[0].trim() == 'for') {
        let args = pack.words
            .join('')
            .split(/([(])/)
            .slice(1)
            .join('')
            .split(/([)])/);
        if (!args[0].includes('in')) args[0]+=';i>=0;i--';
        args = args[0] + args[1];
        if (args == undefined) args = '';
        result += 'for' + args + '\n' +
                '{\n' +
                partcode(
                    pack.words
                        .join('')
                        .split(/([)])/)
                        .slice(2)
                        .join('')) +
                   '}\n';
      } else if (pack.words[0].trim() == '$') {
        let args = pack.words[1];
        if (args == undefined) args = '';
        result += 'if(' + pack.words
            .slice(1)
            .join('')
            .split(/([)])/)[0] +
         pack.words
             .join('')
             .split(/([)])/)[1] +
          ')\n' +
                 '{\n' +
                 partcode(
                     pack.words
                         .join('')
                         .split(/([)])/)
                         .slice(2)
                         .join(''),
                 ) + '}\n';
      } else {
        const ops = ['=', '!', '>', '<', '-', '+'];
        let all = pack.words.join('');
        all = all.replace('<<', '{');
        all = all.replace('>>', '}');
        const sp = pack.words.join('').split(/([(])/);
        const body = sp.slice(1);
        if (ops.some((el) => pack.words.join('').includes(el))) {
          all = all.replace('.=', '='+pack.words[0].split('.')[0]+'.');          
          if(all.startsWith("var") || all.startsWith("const") || all.startsWith("let")){
            if(all.substring(0,all.indexOf(":")).split(" ").slice(1).join("") == "global"){
              var q = all.substring(all.indexOf("=")+1).trim();
              if(q.startsWith("\"") || q.startsWith("'")) q = q.substring(1);
              if(q.endsWith("\"") || q.endsWith("'")) q = q.substring(0,q.length-1);
              _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] = q;
              all = all.split(" ")[0] + all.substring(all.indexOf(":")+1);
              
            }
            else if(all.substring(0,all.indexOf(":")).split(" ").slice(1).join("") == "push"){
              if(_save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] == undefined){
                _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] = [];
              }
              var q = all.substring(all.indexOf("=")+1).trim();
              if(q.startsWith("\"") || q.startsWith("'")) q = q.substring(1);
              if(q.endsWith("\"") || q.endsWith("'")) q = q.substring(0,q.length-1);
              try {
                _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()].push(q); 
              } catch (error) {
                console.log("You cannot use push after global for same variable.");
              }
              all = all.split(" ")[0] + all.substring(all.indexOf(":")+1);
              
            }
            else if(all.substring(0,all.indexOf(":")).split(" ").slice(1).join("") == "log"){
              var q = all.substring(all.indexOf("=")+1).trim();
              result += "console.log(" + q + ");";
              all = all.split(" ")[0] + all.substring(all.indexOf(":")+1);
            }
            else if(all.substring(0,all.indexOf(":")).split(" ").slice(1).join("") == "input"){
              var q = all.substring(all.indexOf("=")+1).trim();
              result += "var " + q + ";console.log(" + all.substring(all.indexOf(":")+1).split("=")[0].trim() + ");process.stdin.once('data', (chunk) => {\n" + q + "=chunk;";
              inps+= exitchecker + "});";
              exitchecker = "";
              all = "";
            }
          }else{
            if(all.substring(0,all.indexOf(":")) == "global"){
              var q = all.substring(all.indexOf("=")+1).trim();
              if(q.startsWith("\"") || q.startsWith("'")) q = q.substring(1);
              if(q.endsWith("\"") || q.endsWith("'")) q = q.substring(0,q.length-1);
              _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] = q;
              all = "";
            }
            else if(all.substring(0,all.indexOf(":")) == "push"){
              if(_save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] == undefined){
                _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()] = [];
              }
              var q = all.substring(all.indexOf("=")+1).trim();
              if(q.startsWith("\"") || q.startsWith("'")) q = q.substring(1);
              if(q.endsWith("\"") || q.endsWith("'")) q = q.substring(0,q.length-1);
              try {
                _save[all.substring(all.indexOf(":")+1).split("=")[0].trim()].push(q);
              } catch (error) {
                console.log("Error: You cannot use push after global for same variable.");
              }
              all = "";
            }
            else if(all.substring(0,all.indexOf(":")) == "log"){
              var q = all.substring(all.indexOf("=")+1).trim();
              result += "console.log(" + q + ");";
              all = "";
            }
            else if(all.substring(0,all.indexOf(":")) == "input"){
              var q = all.substring(all.indexOf("=")+1).trim();
              result += "var " + q + ";console.log(" + all.substring(all.indexOf(":")+1).split("=")[0].trim() + ");process.stdin.once('data', (chunk) => {\n" + q + "=chunk;";
              inps+= exitchecker + "});";
              exitchecker = "";
              all = "";
            }
          }
          result += _strt + all + _end + ';\n';
        } else if (pack.words.join('') != '') {
          result += _strt + sp[0] + body.join('') + ';\n' + _end;
        }
      }
    }
  });
  return result;
}
