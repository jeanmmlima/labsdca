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

//2. Settings

//2.1 Body Parsers
app.use(bodyParsers.urlencoded({extended: true}))
app.use(bodyParsers.json())

//2.2 Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')




//3. Routes

//app.use('/admin',admin)

app.get('/', function(req, res) {
    res.render('home')
})

//4. Others

const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
    console.log("Server is running!")
})