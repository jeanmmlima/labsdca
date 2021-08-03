const mongoose = require('mongoose')
const Schema = mongoose.Schema;

require("./Grupo")
const Grupos = mongoose.model("grupos")

const Bancada = new Schema({
    descricao:{
        type: String,
        required: true
    }
})

Bancada.pre('deleteOne', function(next) {
    const id = this.getQuery()['_id'];
    Grupos.deleteMany({bancada: id}).exec();
    next();
});

mongoose.model("bancadas",Bancada)