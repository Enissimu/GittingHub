const app=require('./app')
const config=require('./Utils/config')
const http=require('http')
const logger=require('./Utils/logger')

const server=http.createServer(app)
const PORT = config.PORT


app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})