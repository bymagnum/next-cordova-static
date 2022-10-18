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
        if (fs.statSync(dirPath + '/' + file).isDirectory() && file != 'next') {
            arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (path.extname(file) == '.html') arrayOfFiles.push(path.join(dirPath, '/', file));
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
    const htmlFile = getAllFiles('www');
    let htmlContent, buffer, newValue;
    htmlFile.forEach(async file => {
        // old detect '.html'
        if (path.extname(file) == '.html') {
            buffer = await fs.readFileSync(file);
            htmlContent = buffer.toString();
            newValue = htmlContent.replace(/\/_next\//gim, '/next/');
            await fs.writeFileSync(file, newValue, { encoding: 'utf-8' });
            console.log('Rename "' + file + '"');
        }
    });

}

www();






