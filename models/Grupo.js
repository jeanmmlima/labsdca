const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('./AlunoLabCon')
const AlunoLabCon = mongoose.model('alunoslabcon')

require('./ReservaLabCon')
const ReservaLabCon = mongoose.model('reservaslabcon')

const Grupo = new Schema({
    descricao:{
        type: String,
        required: true
    },
    bancada:{
        //armazena Id de um objeto de um model
        type: Schema.Types.ObjectId,
        //nome do model
        ref: "bancadas",
        required: true
    },
    turma:{
        type: Schema.Types.ObjectId,
        ref: "turmas",
        required: true
    }
})

Grupo.pre('deleteOne', function(next) {
    const id = this.getQuery()['_id'];
    AlunoLabCon.deleteMany({grupo: id}).exec();
    ReservaLabCon.deleteMany({grupo: id}).exec();
    next();
});

mongoose.model("grupos", Grupo)