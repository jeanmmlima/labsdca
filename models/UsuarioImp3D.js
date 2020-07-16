const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsuarioImp3D = new Schema({

    usuario:{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },

    comentario:{
        type: String,
    },

    ativo: {
        type: Number,
        default: 1
    }
})

mongoose.model("usuariosimp3d", UsuarioImp3D)