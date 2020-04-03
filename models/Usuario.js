const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Admin:{
        type: Number,
        default: 1
    },
    senha: {
        type: String,
        required: true
    },
    ativo:{
        type: Number,
        default: 0
    }
})
mongoose.model("usuarios", Usuario)