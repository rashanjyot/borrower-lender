


var express = require('express')
var app = express();
var bodyparser=require('body-parser');
var jsonParser=bodyparser.json();
var urlencodedParser=bodyparser.urlencoded({extended:false});
var jwt=require('jsonwebtoken');

var mongoose=require('mongoose');
var uristring="mongodb://rashanjyot:Qwertyboard@cluster0-shard-00-00-hltcr.mongodb.net:27017,cluster0-shard-00-01-hltcr.mongodb.net:27017,cluster0-shard-00-02-hltcr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin//HelloMongoose";
//var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/HelloMongoose';
mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return null;
}
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
    console.log("RJ");

    response.send('Hello World!')
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

app.get('/bSignUp',function (req,res) {
    var myToken=getCookie("token");
    if(myToken)
    {
        jwt.verify(myToken, 'secret', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {

                var dummy = mongoose.model('borrower', bSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
                dummy.findOne({ 'email': decoded.email }, function (err, person) {
                    if(person===null)
                        res.sendFile(__dirname+'/public/index.html');
                    else
                    {
                        res.render('bHome',{});
                        res.end();
                    }
                    if (err) res.end("Error");




                })

            }
        });
    }
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

    var dummy = mongoose.model('borrower', bSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    dummy.findOne({ 'email': req.body.email }, function (err, person) {
        if(person===null)
            res.sendFile(__dirname+'/public/bSignIn.html');
        else
        {
            console.log('%s %s is a %s.', person.name, person.email, person.password) // Space Ghost is a talk show host.
            if(person.password===req.body.password)
            {
                var obj={
                    name:person.name,
                    email:person.email
                }
                var token = jwt.sign(obj, 'secret', {

                });
                res.render('bHome',{token:token});


            }
        }
        if (err) res.end("Error");




    })

})

app.get('/lSignIn',function (req,res) {
    res.sendFile(__dirname+'/public/lSignIn.html')

})







