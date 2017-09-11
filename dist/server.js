var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
// app.use(serveStatic(__dirname + '/dist/'));
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'dist')));
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);