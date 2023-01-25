const blogrouter=require('express').Router()
const { request, response } = require('../app')
const Blog=require('../models/blog')


blogrouter.get('/', async(request, response) => {
    const blogs=await Blog.find({})
    response.json(blogs)
  })
  
blogrouter.post('/', async(request, response) => {
  const blog = new Blog(request.body)
  if(blog.hasOwnProperty('likes')===false){
    blog['likes']=0
  }
  
    const result=await blog.save()

    response.status(201).json(result)
})

blogrouter.delete('/:id',async(request,response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})



  
module.exports=blogrouter