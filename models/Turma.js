const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Turma = new Schema({
    descricao: {
        type: String,
        required: true
    },
    subturma: {
        type: String,
        required: true
    }
})

mongoose.model("turmas", Turma)