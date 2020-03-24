const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Bancada = new Schema({
    descricao:{
        type: String,
        required: true
    }
})

mongoose.model("bancadas",Bancada)