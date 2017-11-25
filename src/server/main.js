var express = require('express');
var app = express();

// start server
app.listen(8080, () => { console.log("server started..."); });

// serve static files with express, access via http://domain:port/filename
// @see http://expressjs.com/de/starter/static-files.html
app.use(express.static("dist"));