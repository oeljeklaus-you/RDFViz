var express = require('express');
var path = require('path');
var routes = require('./src/home/index');
var port = process.env.PORT || 3000;
var app = express();
(function () {
    var devConfig = require('./webpack.local.config');
    var webpack = require('webpack');
    ensureBuildExists();
    var compiler = webpack(devConfig);
    app.use(require("webpack-dev-middleware")(compiler, {
        publicPath: devConfig.output.publicPath,
        contentBase: "./build",
        hot: true,
        quiet: false,
        filename: 'bundle.js',
        stats: { colors: true },
        noInfo: false,
        historyApiFallback: true
    }));
})();

app.set('views', './');
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'build')));
app.listen(port);

console.log('app is started on port ' + port);
app.use('/', routes);


function ensureBuildExists() {
    var fs = require('fs');
    var path = require('path');
    var buildDir = path.join(__dirname, 'build');

    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    var source = path.join(__dirname, 'src', 'index.html');
    var dest = path.join(__dirname, 'build', 'index.html');

    console.log('Copying ' + source + ' to ' + dest);
    fs.createReadStream(source).pipe(fs.createWriteStream(dest));
} 