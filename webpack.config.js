const path = require('path'); //For resolving file paths
module.exports = {
    entry: {
        app: './client/maker.jsx',
        login: './client/login.jsx',
        boardDetail: './client/boardDetail.jsx',
        settings: './client/accountSettings.jsx',
        premium: './client/premium.jsx',
    }, 
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
     //The 'main' file of your bundle
    mode: 'production', //Development mode lets us debug client code
    watchOptions: {
        aggregateTimeout: 200, //Prevents multiple rebuilds on save
    },
    output: {
        //Where to put the bundle
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js', //The name of the bundle file
    }
}