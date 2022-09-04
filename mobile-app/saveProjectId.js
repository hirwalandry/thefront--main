const fs = require('fs-extra');
const { exec } = require("child_process");

function writeFile(file, data) {
    fs.outputFile(file, data, 'utf8', function (err) {
        if (err) return console.log(err);
    });
}
writeFile( __dirname + '/config/ExpoId.js', `module.exports.ExpoId = '';`);

exec("eas project:init", (error, stdout, stderr) => {
    if (error) {
        exec("eas project:info", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if(stdout){
                const arr = stdout.toString().replace(/\r\n/g,'\n').split('\n'); 
                for(let i of arr) { 
                    if(i.startsWith("ID")){ 
                        stdout = i; 
                    }
                }
                var id =  stdout.toString().substring(stdout.indexOf('ID')+ 10, stdout.length); 
                writeFile( __dirname + '/config/ExpoId.js', `module.exports.ExpoId = '${id}';`);
            }
        });
        
    }
});