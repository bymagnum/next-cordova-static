#! /usr/bin/env node
var shell = require("shelljs");
var fs = require("fs");
var path = require('path');
var debug = false;


// next build
if (!debug) shell.exec("npm run build");
if (!debug) shell.exec("npm run export");


const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (
                path.extname(file) == '.html' || path.extname(file) == '.css'
            ) {
                arrayOfFiles.push(path.join(dirPath, '/', file));
            }
        }
    });
    return arrayOfFiles;
}


async function www () {

    // Delete dir "www"
    if (!debug) if (fs.existsSync('www')) await fs.rmSync('www', { recursive: true, force: true });
    if (!debug) console.log('Delete dir "www"');

    // Rename dir "/out/" to "/www/"
    if (fs.existsSync('out')) await fs.renameSync('out', 'www');
    console.log('Rename dir "/out/" to "/www/"');

    // Rename "/www/_next/" to "/www/next/"
    if (fs.existsSync('www/_next')) await fs.renameSync('www/_next', 'www/next');
    console.log('Rename "/www/_next/" to "/www/next/"');

    // Change the path "_next" to "next" in files recursively
    const Files = getAllFiles('www');
    let content, buffer, newValue;
    Files.forEach(async file => {
        // old detect '.html' or '.css'
        if (
            path.extname(file) == '.html' || 
            path.extname(file) == '.css'
        ) {
            buffer = await fs.readFileSync(file);
            content = buffer.toString();
            newValue = content.replace(/\/_next\//gim, '/next/');
            await fs.writeFileSync(file, newValue, { encoding: 'utf-8' });
            console.log('Rename "' + file + '"');
        }
    });

}

www();






