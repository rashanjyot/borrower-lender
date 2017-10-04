var express = require('express');
var router = express.Router();
var bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:false});
var mongoose=require('mongoose');
var bSchema=require('../schemas').prototype.bSchema;
var lSchema=require('../schemas').prototype.lSchema;
var creditRecordSchema=require('../schemas').prototype.creditRecordSchema;
var creditRequestSchema=require('../schemas').prototype.creditRequestSchema;
var jwt=require('jsonwebtoken');
var cookieParser = require('cookie-parser');


router.use(cookieParser());


router.all('*',function (req, res,next) {
    //  console.log("Intercepted");


    if(req.cookies.ytoken!=undefined)
    {
        jwt.verify(req.cookies.ytoken, 'secret', function(err, decoded) {

            if(err)
            {
                res.locals.tokenFlag=false;
                return next();
            }


            if(decoded!=undefined){
                res.locals.tokenFlag=true;


                getUser(decoded,function (result) {
                    if(result!==null)
                    {
                        res.locals.obj=result;
                        return next();
                    }

                })


            }

            else
            {
                res.locals.tokenFlag=false;
                return next();
            }

        });

    }
    else{
        res.locals.tokenFlag=false;


        return next();}
})



router.get('/signIn',function (req,res,next) {
    if(res.locals.tokenFlag )
    {
        res.redirect('./home');
        return next();


    }else
    {

        res.sendFile(__dirname + '/views/lSignIn.html')

    }


})


router.post('/signIn',urlencodedParser,function (req,res) {


    var dummy = mongoose.model('lender', lSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    dummy.findOne({ 'email': req.body.email }, function (err, person) {
        if(person===null)
            res.sendFile(__dirname+'/views/lSignIn.html');
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
                res.cookie('ytoken',token);

                res.redirect('./home')




            }
        }
        if (err) res.end("Error");




    })

})

router.get('/home',function (req,res) {

    if(res.locals.tokenFlag)
        res.render(__dirname+'/views/lHome');
    else
        redirectToSignIn(res);

})



router.get('/crList',function (req,res) {
    if(res.locals.tokenFlag)
    {
        var dum=mongoose.model('credit_records',creditRecordSchema);
        dum.find({}, function(err, creditRecords) {



            if(!err) {
                if(!creditRecords) {
                    res.end("No Previous Records");
                }
                else
                {
                    res.end( JSON.stringify(creditRecords));
                }

            }
        });
    }
    else
    {
        redirectToSignIn(res);
    }

})


router.get('/borrowerList',function (req,res) {
    if(res.locals.tokenFlag)
    {
        var dum=mongoose.model('borrowers',bSchema);
        dum.find({}, function(err, borrowers) {



            if(!err) {
                if(!borrowers) {
                    res.end("No Borrowers");
                }
                else
                {
                    res.end( JSON.stringify(borrowers));
                }

            }
        });
    }
    else
    {
        redirectToSignIn(res);
    }

})


router.get('/signUp',function (req,res) {

    if(res.locals.tokenFlag)
        redirectToHome(res);
    else
        res.render(__dirname+'/views/lSignUp',{});
})


router.post('/signUp',urlencodedParser,function (req,res) {




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
})


function getUser(object,callback) {


    var dummy = mongoose.model('lender', lSchema);


    dummy.findOne({ 'email': object.email }, function (err, person) {


        if(person===null) {

            callback(null)
        }
        else
        {
            console.log(JSON.stringify(person))
            callback(person)

        }
        if (err) callback(null);




    })

}

function redirectToSignIn(r)
{
    r.redirect('./signIn');
}

function redirectToHome(r)
{
    r.redirect('./home');
}





module.exports = router;
