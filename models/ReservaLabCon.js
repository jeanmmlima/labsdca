const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservaLabCon = new Schema({
    
    horario: {
        type: Schema.Types.ObjectId,
        ref: "horarios",
        required: true
    },
    grupo: {
        type: Schema.Types.ObjectId,
        ref: "grupos",
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    ativo:{
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now()
    },
})

mongoose.model("reservaslabcon", ReservaLabCon)