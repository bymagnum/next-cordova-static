#! /usr/bin/env node
var shell = require("shelljs");
var fs = require("fs");
var path = require('path');


// next build
shell.exec("npm run build");
shell.exec("npm run export");


// rename "/out/" to "/www/"
fs.rename('out', 'www', (err) => {
    if (err) {
        console.log('Error rename: ' + err);
        return;
    }
    console.log('rename "/out/" -> "/www/"');


    // rename "/www/_next/" to "/www/next/"
    fs.rename('www/_next', 'www/next', (err) => {
        if (err) {
            console.log('Error rename: ' + err);
            return;
        }
        console.log('rename "/www/_next/" -> "/www/next/"');


        // rename "_next" to "next"
        fs.readdir('www', (err, files) => {
            if (err) {
                console.log('Error readdir: ' + err);
                return;
            }
            files.forEach(file => {
                if (path.extname(file) == '.html') {
                    fs.readFile("www/" + file, function(err, buf) {
                        if (err) {
                            console.log('Error readFile: ' + err);
                            return;
                        }
                        var html = buf.toString();
                        var newValue = html.replace(/\/_next\//gim, '/next/');
                        fs.writeFile("www/" + file, newValue, 'utf-8', function (err) {
                            console.log('write file "' + file + '" complete');
                        });
                    });
                }
            });
        });

    });

});





