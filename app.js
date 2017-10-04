

var express = require('express')
var app = express();
var bodyparser=require('body-parser');
var jsonParser=bodyparser.json();
var urlencodedParser=bodyparser.urlencoded({extended:false});
var jwt=require('jsonwebtoken');





var mongoose=require('mongoose');
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';
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



