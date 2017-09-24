//
//
// var http=require('http');
//
// var qs = require('querystring');
// function  onRequest(req,res) {
//
//
//     // if (req.url === '/favicon.ico') {
//     //     res.writeHead(200, {'Content-Type': 'image/x-icon'} );
//     //
//     //     res.status(204);
//     //     res.end();
//     //     console.log('favicon requested');
//     //     return;
//     // }
//
//
//
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.write("hi hi hi");
//     res.end();
//
//     if(req.method=='POST')
//     {
//
//       if(req.url==='/bSignUp')
//       {
//
//           var body='';
//           req.on('data', function (data) {
//               body +=data;
//
//           });
//           req.on('end',function(){
//               var POST =  qs.parse(body);
//               console.log(POST);
//           });
//       }
//
//
//     }
//     else if(req.method=='GET')
//     {
//
//
//     }
//
//
//
//
//
//
// }
//
// http.createServer(onRequest).listen(process.env.PORT || 8055);
//
//

//
//
// var express = require('express')
// var app = express()
//
// app.set('port', (process.env.PORT || 5000))
// app.use(express.static(__dirname + '/public'))
//
// app.get('/', function(request, response) {
//     response.send('Hello World!')
// })
//
// app.listen(app.get('port'), function() {
//     console.log("Node app is running at localhost:" + app.get('port'))
// })
//



//
// var favicon = require('serve-favicon');

var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

app.get("/", function(req, res) {
    res.send("Heroku Demo!");
});

