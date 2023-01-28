const Blog=require('../models/blog')
const User = require('../models/user')

const TestBLogs=[
    {
        title:'JanJanKen',
        author:'Pogchamp',
        url:'yesyesyes',
        likes:69
    },
    {
        title:'ZartDiriZort',
        author:'Monkas',
        url:'komkomkom',
        likes:31
    },
]
const BlogsInDb=(async ()=>{
    const blogs= await Blog.find({})
    return blogs.map(r=>r.toJSON())
})

const UsersInDb=(async ()=>{
    const users=await User.find({})
    return users.map(r=>r.toJSON())
})


module.exports={
    TestBLogs,
    BlogsInDb,
    UsersInDb
}