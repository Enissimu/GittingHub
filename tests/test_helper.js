const Blog=require('../models/blog')

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


module.exports={
    TestBLogs,
    BlogsInDb
}