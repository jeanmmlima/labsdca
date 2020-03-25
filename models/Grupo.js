const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

mongoose.model("grupos", Grupo)