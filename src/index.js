const express = require('express')
const app = express()
const route = require('./route/route')
const mongoose = require('mongoose')

app.use(express.json())

mongoose.connect('mongodb+srv://Aman_Mohadikar:V5FW1Y8X6b2pIiud@cluster0.gdww84s.mongodb.net/project-3', { useNewUrlParser: false }, mongoose.set('strictQuery', true))
    .then(() => console.log('mongoDb is connected'))
    .catch((error) => console.log(error))

app.use('/', route)

app.listen(3000 || process.env.PORT, () => console.log('Express app running on port', (3000 || process.env.PORT)))
