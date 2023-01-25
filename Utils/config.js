const { env } = require('process');

require('dotenv').config()

const PORT=process.env.REACT_APP_PORT;
const mongoUrl=process.env.NODE_ENV!=='test'?
process.env.REACT_APP_MONGODB_URI
:process.env.REACT_APP_TEST_MONGODB_URI
module.exports={
    PORT,
    mongoUrl
};