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

const Handlebars = require('handlebars')
var moment = require('moment')

//1.1 Riqueres routes
const admin = require('./routes/admin')
const usuario = require('./routes/usuario')

//1.2 path para diretorios
const path = require("path")

//1.3 mongoose
const mongoose = require('mongoose')

//1.4 require models
require("./models/Turma")
const Turma = mongoose.model("turmas")

//1.5 data base
const db = require("./config/db")

//1.6 Sessin and flash for messages
const session = require("express-session")
const flash = require("connect-flash")

//1.7 passport - autenticação user
const passport = require("passport")
require("./config/auth")(passport)


//2. Settings

//2.0 Session
app.use(session({
    secret: "labsdca",
    resave: true,
    saveUninitialized: true

}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//2.0.1 Middleware para trabalhar com sessoes
app.use((req,res,next) => {
    //possível guardar variaveis globias
    //res.locals.nome = "Meu nome"
    //flash - sessao temporaria
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    //passport implementa user com dados do usuario autenticado
    res.locals.user = req.user || null
    next()
})

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

//2.4  files - arquivos estaticos em public
app.use(express.static(path.join(__dirname,"public")))

//3. Routes
app.use('/admin',admin)
app.use('/usuario',usuario)

app.get('/', function(req, res) {
    res.render('home')
})

app.get("/404", (req,res) => {
    res.send('Erro 404!')
})


Handlebars.registerHelper('upper', function (aString) {
    return aString.toUpperCase()
})

Handlebars.registerHelper('format_data', function(data){
    var fd = moment(data).format('DD/MM/YYYY');
    return fd
})

Handlebars.registerHelper('format_dia_semana', function(dia_semana){
    var semana = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
    return semana[dia_semana];

})

Handlebars.registerHelper('tipo_usuario', function(admin){
    var tipo = ["Padrão", "Administrador"];
    return tipo[admin];

})

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    
    switch (operator) {
        case 'equals':
            return (v1.equals(v2)) ? options.fn(this) : options.inverse(this);
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

//4. Others
//local port - 8081
//process.env.PORT - porta ambiente do HEROKU
const PORT = process.env.PORT || 8081
app.listen(PORT,() => {
    console.log("Server is running!")
})