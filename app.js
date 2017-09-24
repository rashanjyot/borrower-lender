

var http=require('http');
function  onRequest(req,res) {
    // if (req.url === '/favicon.ico') {
    //     res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    //
    //     res.status(204);
    //     res.end();
    //     console.log('favicon requested');
    //     return;
    // }
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.write("hi hi hi");
    res.end();


}

http.createServer(onRequest).listen(process.env.PORT || 8055);





//
// var favicon = require('serve-favicon');
//
// var express = require("express");
// var bodyParser = require("body-parser");
// var mongodb = require("mongodb");
// var ObjectID = mongodb.ObjectID;
//
// var CONTACTS_COLLECTION = "contacts";
//
// var app = express();
// app.use(bodyParser.json());
//
// // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
// var db;
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')));
// // Connect to the database before starting the application server.
// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
//     if (err) {
//         console.log(err);
//         process.exit(1);
//     }
//
//     // Save database object from the callback for reuse.
//     db = database;
//     console.log("Database connection ready");
//
//     // Initialize the app.
//     var server = app.listen(process.env.PORT || 8080, function () {
//         var port = server.address().port;
//         console.log("App now running on port", port);
//     });
// });
//
// app.get("/", function(req, res) {
//     res.send("Heroku Demo!");
// });


//
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var index = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
