const supertest = require('supertest')
const app=require('../app')
const helper=require('./test_helper')
const Blog=require('../models/blog')
const User=require('../models/user')
const { default: mongoose } = require('mongoose')
const bcrypt=require('bcrypt')
const config=require('../Utils/config')

const token=config.tokenTest


const api=supertest(app)


beforeEach(async ()=>{
    await Blog.deleteMany({})

    for(let blog of helper.TestBLogs){
        const NewBlog=new Blog(blog)
        await NewBlog.save()
    }
} )


describe('when there is initially user in db',()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})

        const passwordHash=await bcrypt.hash('sikrit',10)
        const user=new User({username:'Testerkok',passwordHash})

        await user.save()
    })



    test('Creation sucsee with fresh username',async()=>{
        const usersAtStart=await helper.UsersInDb()


        const testUser={
            username:'Testerson',
            name:'TesterOglu',
            password:'Pasapport'
        }

        await api
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)


        const usersAtEnd=await helper.UsersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length+1)

        const usernameList=usersAtEnd.map(r=>r.username)

        expect(usernameList).toContain(testUser.username)

    })

    test('Creation fail with same username ?',async()=>{
        const usersAtStart=await helper.UsersInDb()


        const testUser={
            username:'Testerkok',
            name:'TesterOglu',
            password:'Pasapport'
        }

        const result=await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd=await helper.UsersInDb()

        expect(result.body.error).toContain('expected `username` to be unique')

        expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('Can you create with invalid stats?',async()=>{
        const usersAtStart=await helper.UsersInDb()


        const testUser={
            username:'Testerkok',
            name:'TesterOglu',
            password:'Pa'
        }

        const result=await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)


        const usersAtEnd=await helper.UsersInDb()

        expect(result.body.error).toContain('invalid username or password')

        expect(usersAtEnd).toEqual(usersAtStart)



    })
})
describe('Can you login with token?',()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})

        const passwordHash=await bcrypt.hash('sikrit',10)
        const user=new User({username:'Testerkok',passwordHash})

        await user.save()
    })

    test('You can login',async()=>{
        const loginUser={
            username:'Testerkok',
            password:'sikrit'
        }

        const result=await api   
        .post('/api/login')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(result.body).toHaveProperty('token')
    })

})







describe('Blog returning sending update delete after login ?',()=>{
    beforeAll(async ()=>{
        await User.deleteMany({})

        const passwordHash=await bcrypt.hash('sikrit',10)
        const user=new User({username:'Testerkok',passwordHash})

        await user.save()

        const loginUser={
            username:'Testerkok',
            password:'sikrit'
        }

        const result=await api   
        .post('/api/login')
        .send(loginUser)
        
        this.mocktToken=result.body.token
    })
    
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
        .set('Authorization',`Bearer ${this.mocktToken}`)
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
        .set('Authorization',`Bearer ${this.mocktToken}`)
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
        .set('Authorization',`Bearer ${this.mocktToken}`)
        .expect(400)
    })
    
    
    test('Does it delete the shit?',async ()=>{
        const blogsAtStart=await helper.BlogsInDb()
        const delettenOne=blogsAtStart[0]
        await api
        .delete(`/api/blogs/${delettenOne.id}`)
        .set('Authorization',`Bearer ${this.mocktToken}`)
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
    
})




afterAll(()=>{
     mongoose.connection.close()
})