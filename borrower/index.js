var express = require('express');
var router = express.Router();
var bodyparser=require('body-parser');
var urlencodedParser=bodyparser.urlencoded({extended:false});
var mongoose=require('mongoose');
var bSchema=require('../schemas').prototype.bSchema;
var creditRecordSchema=require('../schemas').prototype.creditRecordSchema;
var creditRequestSchema=require('../schemas').prototype.creditRequestSchema;
var jwt=require('jsonwebtoken');
var cookieParser = require('cookie-parser');


router.use(cookieParser());

//for authentication purpose
router.all('*',function (req, res,next) {
  //  console.log("Intercepted");


    if(req.cookies.xtoken!=undefined)
    {
        jwt.verify(req.cookies.xtoken, 'secret', function(err, decoded) {

            if(err)
            {
                res.locals.tokenFlag=false;
                return next();
            }


            if(decoded!=undefined){
                res.locals.tokenFlag=true;
                // res.locals.xtoken=decoded;
               //res.locals.obj=getUser(decoded,);

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

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});



router.get('/signIn',function (req,res,next) {
    if(res.locals.tokenFlag )
    {
        res.redirect('./home');
        return next();


    }else
     {

        res.sendFile(__dirname + '/views/bSignIn.html')

    }


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

    if(res.locals.tokenFlag)
    res.render(__dirname+'/views/bHome');
    else
        redirectToSignIn(res);

})


router.post('/crRequest',urlencodedParser,function (req,res) {





    if(res.locals.tokenFlag)
    {
        if(req.body.amount<=res.locals.obj.crLimit)
        {
            var dummy = mongoose.model('borrower', bSchema);
            dummy.findById(res.locals.obj._id, function (err, per) {
                if (err) return handleError(err);

                per.crLimit = per.crLimit-req.body.amount;
                per.save(function (err, updatedPer) {
                    if (err) return handleError(err);
                    res.locals.obj=updatedPer;


                    var dum=mongoose.model('credit_records',creditRecordSchema);
                    dum.findOne({email: res.locals.obj.email}, function(err, creditRecord) {
                        if(!err) {
                            if(!creditRecord) {

                                creditRecord=new dum({
                                    email : res.locals.obj.email,
                                    records:[]
                                })


                            }


                            var d = mongoose.model('credit_request', creditRequestSchema);

                            var dumm = new d({
                                amount: req.body.amount,
                                repayDate: req.body.repayDate,
                                isRepaymentDone:false
                            });

                            creditRecord.records.push(dumm);

                            creditRecord.save(function(err) {
                                if(!err) {
                                        console.log("Saved");
                                }
                                else {
                                    console.log("Error: could not save");
                                }
                            });
                        }
                    });
                    console.log(JSON.stringify(res.locals.obj))
                    res.end("Credit Request Accepted")
                });
            });
        }
        else
        {
            res.end("Could not complete Credit Request as Amount Exceeded");
        }
    }
    else
    {
        redirectToSignIn(res);
    }



})



router.get('/crList',function (req,res) {
    if(res.locals.tokenFlag)
    {
        var dum=mongoose.model('credit_records',creditRecordSchema);
        dum.findOne({email: res.locals.obj.email}, function(err, creditRecord) {
            if(!err) {
                if(!creditRecord) {
                    res.end("No Previous Records");
                }
                else
                {
                   res.end( JSON.stringify(creditRecord.records));
                }

            }
        });
    }
    else
    {
        redirectToSignIn(res);
    }

})



router.post('/signUp',urlencodedParser,function (req,res) {




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


})


router.get('/signUp',function (req,res) {

    if(res.locals.tokenFlag)
        redirectToHome(res);
    else
    res.render(__dirname+'/views/bSignUp',{});
})




function getUser(object,callback) {


    var dummy = mongoose.model('borrower', bSchema);

// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
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
