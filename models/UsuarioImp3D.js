const mongoose = require('mongoose')
const Schema = mongoose.Schema
require("./ReservaImp3D")
const ReservaImp3D = mongoose.model("reservasimp3d")

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

//middleware para registro que dependam do usuário imp 3d
UsuarioImp3D.pre('deleteOne', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    const id = this.getQuery()['_id'];
    //console.log(id);
    ReservaImp3D.deleteMany({usuario3d: id}).exec();
    next();
});

mongoose.model("usuariosimp3d", UsuarioImp3D)