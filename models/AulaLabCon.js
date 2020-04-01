const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AulaLabCon = new Schema({
    dia_semana:{
        type: Number,
        required: true
    },
    horario:{
        type: Schema.Types.ObjectId,
        ref: "horarios",
        required: true
    },
    comentario:{
        type: String,
        default: "Aula no lab con!"
    }
})

mongoose.model("aulaslabcon", AulaLabCon)