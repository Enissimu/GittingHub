const bcrypt=require('bcrypt')
const usersRouter = require('express').Router()
const User=require('../models/user')

usersRouter.post('/',async (request,response)=>{
    const {username,name,password}=request.body

    const saltRounds=10
    if(password.length<3){
        console.log(password)
        return response.status(400).
        json({error:'invalid username or password'})
    }
    
    const passwordHash=await bcrypt.hash(password,saltRounds)

    const user=new User({
        username:username,
        name:name,
        passwordHash:passwordHash
    })

    
    const savedUser=await user.save()
    response.status(201).json(savedUser).end()
})

usersRouter.get('/',async (requset,response)=>{
    const users=await User.find({})
    .populate('blogs',{user:0})
    response.json(users)
})

module.exports=usersRouter