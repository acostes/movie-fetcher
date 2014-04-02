var express = require('express');
var app = express();

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/app');
    app.set('view engine', 'html');
    app.use(express.static(__dirname + '/app'));
});

// Start server
var port  = process.env.PORT || 3001;
app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});