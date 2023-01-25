const mongoose=require('mongoose')

const userScheme=new mongoose.Schema({
    username:String,
    name:String,
    passwordHash:String,
    blogs:[
        {
            type:mongoose.Schema.Types.ObjectId
            ref:'Blog'
        }
    ],
})

userScheme.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id=returnedObject.__id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User=mongoose.model('User',userScheme)

module.exports=User