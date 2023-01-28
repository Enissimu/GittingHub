const logger=require('./logger')
const User=require('../models/user')
const jwt=require('jsonwebtoken')


const unkownendpoint=(req,res)=>{
    res.status(404).send({ error: 'unknown endpoint' })
}
const requestlogger=(req,res,next)=>{
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}
const tokenExtractor=(req,res,next)=>{
  const auth=req.get('authorization')
  if(auth&&auth.startsWith('Bearer ')){
    req['token']=auth.replace('Bearer ', '')
  }
  else{
    req['token']=null
  }
  next()
}
const userExtractor=async (req,res,next)=>{
  const decodedToken = jwt.verify(req.token, process.env.REACT_APP_SECRET)
  if (!decodedToken.id)
  {    return res.status(401)
    .json({ error: 'token invalid' }) 
  }
  req['user']=await User.findById(decodedToken.id)
  next()
}
const errorhandler=(error,request,response,next)=>{
    logger.error(error.message,error.name);
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    else if (error.name==='JsonWebTokenError'){
      return response.status(401).json({error:'token missing or invalid'})
    }
    else if (error.name==='TokenExpiredError'){
      return response.status(401).json({
        error:'Token expired'
      })
    }
    next(error)
}


module.exports={
    unkownendpoint,
    requestlogger,
    errorhandler,
    tokenExtractor,
    userExtractor
}