const express = require('express')
const app = express()

const {port, mongoString} = require('./config')

app.use(express.json())
//app.use(express.urlencoded())

const route = require('./routes/route')
app.use('/', route)

const mongoose = require('mongoose')
mongoose.connect(mongoString)
.then(console.log("MongoDb is Connected"))
.catch(error => console.log(error))

app.listen(port || 4000, () => {
    console.log("Connected to port" , port || 4000)
})