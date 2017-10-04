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




var creditRequestSchema=new mongoose.Schema(
    {
        amount:{type: Number, min:0},
        repayDate:{type:Date},
        isRepaymentDone:{type:Boolean, default:false}
    }
)

var creditRecordSchema=new mongoose.Schema(
    {
        email:{type: String,  index: true, unique: true},
        records:[creditRequestSchema]

    }
)


// exports.lSchema=lSchema;
// exports.bSchema=bSchema;


    var Schema=function()
{

}

Schema.prototype.bSchema=bSchema;
    Schema.prototype.lSchema=lSchema;
    Schema.prototype.creditRecordSchema=creditRecordSchema;
Schema.prototype.creditRequestSchema=creditRequestSchema;
    module.exports=Schema;
