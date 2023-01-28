const mongoose=require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')


const userScheme=new mongoose.Schema({
    username:{type:String,
    minLength:3,
    unique:true,
    required:true},
    name:{type:String,
    minLength:3},
    passwordHash:String,
    blogs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Blog'
        }
    ],
})

userScheme.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

userScheme.plugin(mongooseUniqueValidator)
const User=mongoose.model('User',userScheme)

module.exports=User