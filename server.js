var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');
var config = require('nconf');
var app = express();

config.argv()
    .env()
    .file({ file: 'config/config.json' });

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/app');
    app.set('view engine', 'html');
    app.use(express.static(__dirname + '/app'));
    app.use(express.urlencoded());
    app.use(express.json());
});

app.post('/upload', function(req, res) {
    var fileName = path.basename(req.body.url);
    var targetPath = config.get('upload_path') + '/' + fileName;

    if (config.get('download') == 'server') {
        fs.exists(config.get('upload_path'), function(exists) {
            if (exists) {
                var file = fs.createWriteStream(targetPath);
                var request = http.get(req.body.url, function(response) {
                    response.pipe(file);
                    res.json({'response': 'success', 'message': 'Download ' + fileName + ' successfull', 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
                }).on('error', function(e) {
                    response = 'danger';
                    res.json({'response': 'danger', 'message': 'An error occure during downloading ' + fileName, 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
                });
            } else {
                res.json({'response': 'danger', 'message': config.get('upload_path') + ' doesn\'t exist.', 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
            }
        });
    } else {
        res.json({'response': 'success', 'message': 'Download ' + fileName + ' successfull', 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
    }
});

// Start server
var port  = process.env.PORT || 3001;
app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});