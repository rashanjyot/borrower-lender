var mongoose=require('mongoose');



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

// exports.lSchema=lSchema;
// exports.bSchema=bSchema;


    var Schema=function()
{

}

Schema.prototype.bSchema=bSchema;
    Schema.prototype.lSchema=lSchema;
    module.exports=Schema;
