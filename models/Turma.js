const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Turma = new Schema({
    nome: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    }
})

mongoose.model("turmas", Turma)