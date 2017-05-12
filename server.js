var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var url = require('url');
var config = require('nconf');
var app = express();
var Transmission = require('transmission');
var request = require('request');

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

var transmission = new Transmission({
    port     : config.get('rpc-port'),
    host     : config.get('rpc-host'),
    username : config.get('username'),
    password : config.get('password'),
});

app.post('/upload', function(req, res) {
    var protocol = url.parse(req.body.url).protocol.replace(':', '');
    var fileName = path.basename(req.body.url);
    var movieName = req.body.name;
    var targetPath = config.get('upload_path') + '/' + fileName;

    if (config.get('download') == 'server') {
        transmission.addUrl(req.body.url, {
            //options
        }, function(err, result) {
            if (err) {
                res.json({'response': 'danger', 'message': err.result, 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
            } else {
                res.json({'response': 'success', 'message': 'Download ' + movieName + ' successfull', 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
            }
        });
    } else {
        res.json({'response': 'success', 'message': 'Download ' + movieName + ' successfull', 'download' : config.get('download'), 'url': req.body.url, 'name': fileName});
    }
});

app.get('/api/tv/*', function(req, res) {
    var query = req._parsedOriginalUrl.path
    query = '/' + query.split('/').slice(3).join('/');
    request('https://datasearch.herokuapp.com' + query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
});

app.get('/api/movie/list', function(req, res) {
    var query = req._parsedOriginalUrl.search
    request('https://yts.ag/api/v2/list_movies.json' + query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
});

app.get('/api/movie/info', function(req, res) {
    var query = req._parsedOriginalUrl.search
    request('https://yts.ag/api/v2/movie_details.json' + query, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    })
});

// Start server
var port  = process.env.PORT || 3001;
app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});