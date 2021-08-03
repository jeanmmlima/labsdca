const mongoose = require('mongoose')
const Schema = mongoose.Schema;

require("./Grupo")
const Grupos = mongoose.model("grupos")

const Turma = new Schema({
    descricao: {
        type: String,
        required: true
    },
    subturma: {
        type: String,
        required: true
    }
})


Turma.pre('deleteOne', function(next) {
    const id = this.getQuery()['_id'];
    Grupos.deleteMany({turma: id}).exec();
    next();
});

mongoose.model("turmas", Turma)