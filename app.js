


var express = require('express')
var app = express();
var bodyparser=require('body-parser');
var jsonParser=bodyparser.json();
var urlencodedParser=bodyparser.urlencoded({extended:false});

var mongoose=require('mongoose');
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});


var bSchema = new mongoose.Schema({
    name: {
        type: String, minlength:1
    },
    email: { type: String, minlength: 5, unique: true, index: true},
    password:{ type:String,minlength:6},
    crLimit:{ type: Number, min:0}
});
var lSchema = new mongoose.Schema({
    name: {
        type: String, minlength:1
    },
    email: { type: String, minlength: 5, unique: true, index: true},
    password:{ type:String,minlength:6}

});

app.set('port', (process.env.PORT || 8055))
app.set('view engine','ejs');
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
    response.send('Hello World!')
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.get('/bSignUp',function (req,res) {
    res.render('bSignUp',{});
})

app.post('/bSignUp',urlencodedParser,function (req,res) {


    var bUser = mongoose.model('borrower', bSchema);

    var dummy = new bUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        crLimit: 100000
    });

    // Saving it to the database.
    dummy.save(function (err) {
        if (err) {
            console.log('Error on save!')
            res.end("Information inappropriate. Try Again");
        }
        else {
            res.end("New Record created successfully");
        }

    });

});

    app.get('/lSignUp',function (req,res) {
        res.render('lSignUp',{});
    });



    app.post('/lSignUp',urlencodedParser,function (req,res) {


        var lUser = mongoose.model('lender', lSchema);
        lUser.count({}, function (err, count) {
                if (count > 0)
                    res.end("Lender Already Exists");
                else {
                    var dummy = new lUser({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,

                    });
                    dummy.save(function (err) {
                        if (err) {
                            console.log('Error on save!')
                            res.end("Information inappropriate. Try Again");
                        }
                        else {
                            res.end("New Record created successfully");
                        }
                    });

                }
            }
        );


});



app.get('/bSignIn',function (req,res) {
    res.sendFile(__dirname+'/public/bSignIn.html')

})



app.post('/bSignIn',urlencodedParser,function (req,res) {


})

app.get('/lSignIn',function (req,res) {
    //res.render('index.html',{});
    res.sendFile(__dirname+'/public/lSignIn.html')

})


