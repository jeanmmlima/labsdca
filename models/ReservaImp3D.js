const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservaImp3D = new Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
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

mongoose.model("reservasimp3d", ReservaImp3D)