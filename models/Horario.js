const mongoose = require('mongoose')
const Schema = mongoose.Schema;

require('./AulaLabCon')
const AulaLabCon = mongoose.model('aulaslabcon')

require('./ReservaLabCon')
const ReservaLabCon = mongoose.model('reservaslabcon')

const Horario = new Schema({
    descricao:{
        type: String,
        required: true
    }
})

Horario.pre('deleteOne', function(next) {
    const id = this.getQuery()['_id'];
    AulaLabCon.deleteMany({horario: id}).exec();
    ReservaLabCon.deleteMany({horario: id}).exec();
    next();
});

mongoose.model("horarios",Horario)