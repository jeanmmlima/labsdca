const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('./AlunoLabCon')
const AlunoLabCon = mongoose.model('alunoslabcon')

require('./UsuarioImp3D')
const UsuarioImp3D = mongoose.model('usuariosimp3d')

const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    admin:{
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    },
    ativo:{
        type: Number,
        default: 1
    },
    token_senha:{
        type: String,
        default: 0
    }
})

Usuario.pre('deleteOne', function(next) {
    const id = this.getQuery()['_id'];
    AlunoLabCon.deleteOne({usuario: id}).exec();
    UsuarioImp3D.deleteOne({usuario: id}).exec();
    next();
});

mongoose.model("usuarios", Usuario)