const fs = require('fs');
const path = require('path');

const addJsExtensions = dir => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            // recursively add .js extensions in subdirectories
            addJsExtensions(filePath);
        } else if (filePath.endsWith('.js')) {
            // add .js extension to import statements so the browser could find the files

            let content = fs.readFileSync(filePath, 'utf8');

            content = content.replace(/(import\s.*from\s+['"].*?)(['"])/g, '$1.js$2');

            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
};

// add .js extensions in the 'dist' directory (or wherever your compiled files are)
addJsExtensions(path.join(__dirname, 'dist'));
