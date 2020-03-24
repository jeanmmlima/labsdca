const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Horario = new Schema({
    descricao:{
        type: String,
        required: true
    }
})

mongoose.model("horarios",Horario)