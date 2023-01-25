const supertest = require('supertest')
const app=require('../app')
const helper=require('./test_helper')
const Blog=require('../models/blog')
const { default: mongoose } = require('mongoose')


const api=supertest(app)


beforeEach(async ()=>{
    await Blog.deleteMany({})

    for(let blog of helper.TestBLogs){
        const NewBlog=new Blog(blog)
        await NewBlog.save()
    }
} )


test('Does it return correct amount of blogs',async ()=>{
    const response=await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.TestBLogs.length)
})

test('Does it has a valid id or smh idk man wtf',async ()=>{
    const response=await api.get('/api/blogs')
    expect(response.body.hasOwnProperty('id')).toBeDefined()
})

test('Can you send a new blog?',async ()=>{
    const NewBlog={
        title:'Testeroglu',
        author:'Testerter',
        url:'3131313',
        likes:739452
    }

    await api
    .post('/api/blogs')
    .send(NewBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


    const blogsAtStart= await helper.BlogsInDb()

    expect(blogsAtStart).toHaveLength(helper.TestBLogs.length+1)

    const contents=blogsAtStart.map(n=>n.title)
    expect(contents).toContain('Testeroglu')

})

test('Does it default to like to 0 if likes do no exist',async ()=>{
    const NewBlog={
        title:'Testeroglu',
        author:'Testerter',
        url:'3131313',
        }
    const response=await api
    .post('/api/blogs')
    .send(NewBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


    expect(response.body).toHaveProperty('likes')
})

test('Does it give 400 error?',async ()=>{
    const NewBlog={
        author:'Testerter',
        url:'3131313',
        likes:31
        }

     await api
    .post('/api/blogs')
    .send(NewBlog)
    .expect(400)
})


test('Does it delete the shit?',async ()=>{
    const blogsAtStart=await helper.BlogsInDb()
    const delettenOne=blogsAtStart[0]
    await api
    .delete(`/api/blogs/${delettenOne.id}`)
    .expect(204)
    
    const blogsAtEnd=await helper.BlogsInDb()
    const titles=blogsAtEnd.map(r=>r.title)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)
    expect(titles).not.toContain(delettenOne.title)
})


test('Does it update the shit ?',async ()=>{
    const blogsAtStart=await helper.BlogsInDb()
    const updaten=blogsAtStart[0]
    
    const likes={likes:updaten.likes+1}
    await api
    .put(`/api/blogs/${updaten.id}`)
    .send(likes)
    .expect(204)

    
    const blogsAtEnd=await helper.BlogsInDb()
    const updatenOneEnd=blogsAtEnd.find(r=>updaten.title===r.title)
    expect(updatenOneEnd.likes).toBe(updaten.likes+1)


})



afterAll(()=>{
     mongoose.connection.close()
})