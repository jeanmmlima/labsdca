/* app labs dca
UFRN-CT-DCA
Eng. Msc. Jean Mário M. Lima
02-03-2020
*/

//1. Loading Modules

const express = require('express')
const handlebars = require('express-handlebars')
const bodyParsers = require('body-parser')
const app = express()
const utf8 = require('utf8')

//1.1 Riqueres routes
const admin = require('./routes/admin')

//1.2 path para diretorios
const path = require("path")

//1.3 mongoose
const mongoose = require('mongoose')

//1.4 require models
require("./models/Turma")
const Turma = mongoose.model("turmas")

//1.5 data base
const db = require("./config/db")


//2. Settings

//2.1 Body Parsers
app.use(bodyParsers.urlencoded({extended: true}))
app.use(bodyParsers.json())

//2.2 Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//2.3 Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI,{useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("Conectado ao mongo!")
}).catch((err) => {
    console.log("Erro ao se conectar: "+err)
})


//3. Routes
app.use('/admin',admin)

app.get('/', function(req, res) {
    res.render('home')
})

app.get("/404", (req,res) => {
    res.send('Erro 404!')
})

//4. Others
//local port - 8081
//process.env.PORT - porta ambiente do HEROKU
const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
    console.log("Server is running!")
})