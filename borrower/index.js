var express = require('express');
var router = express.Router();
var bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:false});
var mongoose=require('mongoose');
var bSchema=require('../schemas').prototype.bSchema;
var jwt=require('jsonwebtoken');
var cookieParser = require('cookie-parser');

router.use(cookieParser());

//for authentication purpose
router.all('*',function (req, res,next) {
  //  console.log("Intercepted");
    //console.log(req.cookies.xtoken);

    if(req.cookies.xtoken!=undefined)
    {
        jwt.verify(req.cookies.xtoken, 'secret', function(err, decoded) {

            if(err)
            {
                res.locals.tokenFlag=false;
                next();
            }


            if(decoded!=undefined){
                res.locals.tokenFlag=true;
                res.locals.xtoken=decoded;
            }

            else
            {
                res.locals.tokenFlag=false;
                next();
            }

        });

    }
    else
        res.locals.tokenFlag=false;

    console.log(res.locals.tokenFlag);
    next();
})

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});



router.get('/signIn',function (req,res,next) {
    if(res.locals.tokenFlag)
    {
        res.redirect('./home');
        next();
    }

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

            //console.log('%s %s is a %s.', person.name, person.email, person.password) // Space Ghost is a talk show host.
            if(person.password===req.body.password)
            {
                var obj={
                    name:person.name,
                    email:person.email
                }
                var token = jwt.sign(obj, 'secret', {

                });
                // res.writeHead(200, {
                //     'Set-Cookie': 'token='+token,
                //
                // });
                res.cookie('xtoken',token);

                res.redirect('./home')




            }
        }
        if (err) res.end("Error");




    })

})


router.get('/home',function (req,res) {
    res.render(__dirname+'/views/bHome');
})


router.post('/crRequest',urlencodedParser,function (req,res) {


})


module.exports = router;
