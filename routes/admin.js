const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

require("../models/Turma")
const Turmas = mongoose.model("turmas")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/turmas', (req, res) => {
    Turmas.find().then((turmas) => {
        res.render("admin/turmas",{turmas: turmas})
    }).catch((err) => {
        console.log("Houve erro ao listar turmas!")
        res.redirect("/admin")
    })
})

router.get('/turmas/add', (req,res) => {
    res.render("admin/addturma")
})

router.post("/turmas/nova", (req,res) => {
    
    const novaTurma = {
        nome: req.body.nome,
        horario: req.body.horario
    }

    new Turmas(novaTurma).save().then(() => {
        console.log("Turma Salva comSucesso!")
        res.redirect("/admin/turmas")
    })
})

module.exports = router