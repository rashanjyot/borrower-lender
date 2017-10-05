



var express = require('express')
var app = express();
var bodyparser=require('body-parser');
var jsonParser=bodyparser.json();
var urlencodedParser=bodyparser.urlencoded({extended:false});
var jwt=require('jsonwebtoken');





var mongoose=require('mongoose');
var uristring="mongodb://rashanjyot:Qwertyboard@cluster0-shard-00-00-hltcr.mongodb.net:27017,cluster0-shard-00-01-hltcr.mongodb.net:27017,cluster0-shard-00-02-hltcr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
//var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});


app.set('port', (process.env.PORT || 8055))
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'))



////////// section to import self created modules
var borrower=require('./borrower')
app.use('/borrower',borrower);

var lender=require('./lender')
app.use('/lender',lender);



app.get('/', function(request, response) {

    response.send('Hello World!')
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

