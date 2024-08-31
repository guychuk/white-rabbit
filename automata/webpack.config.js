const path = require('path');

module.exports = {  
    mode: 'development',
    devtool: 'eval-source-map', // for production: 'source-map'
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,  // '$' means the end of the file
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],  // __dirname is the current directory
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        publicPath: '',
        filename: 'index.js',
        path: path.resolve(__dirname, 'public')
    }
};
