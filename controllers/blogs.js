const blogrouter=require('express').Router()
const jwt=require('jsonwebtoken')
const { request, response } = require('../app')
const Blog=require('../models/blog')
const User = require('../models/user')
const middleware=require('../Utils/middleware')


blogrouter.get('/', async(request, response) => {
    const blogs=await Blog.find({}).populate('user',{blogs:0})
    response.json(blogs)
  })
  


blogrouter.post('/',middleware.userExtractor, async(request, response) => {
  const body=request.body

  const user=request.user

  if(body.hasOwnProperty('likes')===false){
    body['likes']=0
  }
  const NewBlog=new Blog({
    author:body.author,
    title:body.title,
    likes:body.likes,
    url:body.url,
    user:user._id
  })

  
    const result=await NewBlog.save()
    user.blogs=user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogrouter.delete('/:id',middleware.userExtractor,async(request,response)=>{
  const blogId=request.params.id
  const blog =await Blog.findById(blogId)

  const user=request.user
  console.log("DELETTTE",user,"BLOOOG",blog)
  if(user.id!==blogId){
    return response.status(403)
    .json({error:"You are forbidden."})
  }
  await Blog.findByIdAndDelete(blogId)
  
  response.status(204).end()
})

blogrouter.put('/:id',async(request,response)=>{
  await Blog.findByIdAndUpdate(request.params.id,request.body)
  response.status(204).end()
})

  
module.exports=blogrouter