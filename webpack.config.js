var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname + '/app',
    entry: [
        "./app.js",
    ],
    output: {
        path: __dirname + '/app',
        filename: "bundle.js"
    },
    // module: {
    //     rules: [{
    //         test: /\.scss$/,
    //         use: [{
    //             loader: "style-loader" // creates style nodes from JS strings
    //         }, {
    //             loader: "css-loader" // translates CSS into CommonJS
    //         }, {
    //             loader: 'postcss-loader', // Run post css actions
    //             options: {
    //                 plugins: function () { // post css plugins, can be exported to postcss.config.js
    //                     return [
    //                         require('precss'),
    //                         require('autoprefixer')
    //                     ];
    //                 }
    //             }
    //         }, {
    //             loader: "sass-loader" // compiles Sass to CSS
    //         }]
    //     }]
    // },

    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"}
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "app"),
        compress: true,
        port: 9001
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Popper: ['popper.js', 'default'],
            //         'window.jQuery': 'jquery',
            //         // In case you imported plugins individually, you must also require them here:
            //         Util: "exports-loader?Util!bootstrap/js/dist/util",
            //         Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        })
    ]
};