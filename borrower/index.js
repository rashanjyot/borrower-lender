var express = require('express');
var router = express.Router();
var bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:false});
var mongoose=require('mongoose');
var bSchema=require('../schemas').prototype.bSchema;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



router.get('/signIn',function (req,res) {
    console.log(__dirname);
    res.sendFile(__dirname+'/views/bSignIn.html')


})

router.post('/signIn',urlencodedParser,function (req,res) {

    var dummy = mongoose.model('borrower', bSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    dummy.findOne({ 'email': req.body.email }, function (err, person) {
        if(person===null)
            res.sendFile(__dirname+'/views/bSignIn.html');
        else
        {
            console.log('%s %s is a %s.', person.name, person.email, person.password) // Space Ghost is a talk show host.
            if(person.password===req.body.password)
            {
                var obj={
                    name:person.name,
                    email:person.email
                }
                // var token = jwt.sign(obj, 'secret', {
                //
                // });
                // res.render('bHome',{token:token});
                res.render('./bHome',{token:1});


            }
        }
        if (err) res.end("Error");




    })

})

module.exports = router;
