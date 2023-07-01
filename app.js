const express = require('express')
const app = express();

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const user = require('./controller/user')

// app.post('/signup/',user.getsignupdata)



app.listen(3000,()=>{
    console.log('start-server')
})
