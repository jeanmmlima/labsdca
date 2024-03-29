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
const cron = require('node-cron')
const shell = require('shelljs')

const Handlebars = require('handlebars')
var moment = require('moment')

require('dotenv').config({
    path: process.env.NODE_ENV === "production" ? ".env" : ".env.example"
})

//1.1 Riqueres routes
const admin = require('./routes/admin')
const usuario = require('./routes/usuario')
const imp3d = require('./routes/imp3d')

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
//mongoose.connect(db.mongoURI,{useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
mongoose.connect(process.env.MONGOURI,{useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    console.log("Conectado ao mongo!")
}).catch((err) => {
    console.log("Erro ao se conectar: "+err)
})

//2.4  files - arquivos estaticos em public
app.use(express.static(path.join(__dirname,"public")))

//3. Routes
app.use('/admin',admin)
app.use('/usuario',usuario)
app.use('/imp3d',imp3d)

app.get('/', function(req, res) {
    res.render('home')
})

app.get("/404", (req,res) => {
    res.send('Erro 404!')
})

/*
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})*/
3
// Handle 404
app.use(function(req, res) {
    res.status(400);
   res.render('paginaerro', {title: '404: File Not Found'});
   });
   
   // Handle 500
   app.use(function(error, req, res, next) {
     res.status(500);
   res.render('paginaerro', {title:'500: Internal Server Error', error: error});
   });


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

Handlebars.registerHelper('selected', function(option, value){
    if (option.equals(value)) {
        return ' selected';
    } else {
        return ''
    }
});

/* 
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)

'01 01 00 * * *'
*/

cron.schedule("00 10 17 * * *", function() {
    console.log("---------------------");
    console.log("Running Cron Job");

    //atualização de reservas
    if (shell.exec(process.env.UPDATE_RESERVAS_LABCON).code !== 0) {
      shell.exit(1);
    }
    else{
      shell.echo("reservas labcon atualizadas!");
    }
    if (shell.exec(process.env.UPDATE_RESERVAS_IMP3D).code !== 0) {
        shell.exit(1);
      }
      else{
        shell.echo("reservas impressora3d atualizadas!");
      }
      //dump do banco
    if (shell.exec(process.env.PATH_DUMPDB).code !== 0) {
        shell.exit(1);
    }
    else{
        shell.echo("Dump realizado com sucesso!");
    }
   
  });
//4. Others
//local port - 8081
//process.env.PORT - porta ambiente do HEROKU
const PORT = process.env.PORT //||
app.listen(PORT,() => {
    console.log("Servidor está rodando!")
})