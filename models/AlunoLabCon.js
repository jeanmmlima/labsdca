const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlunoLabCon = new Schema({

    usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },

    grupo: {
        type: Schema.Types.ObjectId,
        ref: "grupos",
        required: true
    },

    ativo: {
        type: Number,
        default: 1
    }
})

mongoose.model("alunoslabcon", AlunoLabCon)