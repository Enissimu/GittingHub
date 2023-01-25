const http = require('http')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const {PORT,mongoUrl}=require('./Utils/config')
const logger=require('./Utils/logger')
const {unkownendpoint,requestlogger,errorhandler}=require('./Utils/middleware')
const blogrouter = require('./controllers/blogs')
const mongoose=require('mongoose')

logger.info('COnnecting to',mongoUrl)
mongoose.connect(mongoUrl)
.then(()=>{logger.info('Connected Succsefully to the database')
})
.catch((error)=>{
    logger.error('error connecting to the db',error.message)
})


app.use(cors())
app.use(express.json())
app.use(requestlogger)

app.use('/api/blogs',blogrouter)

app.use(unkownendpoint)
app.use(errorhandler)

module.exports=app

