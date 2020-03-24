const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

//require models

require("../models/Turma")
const Turmas = mongoose.model("turmas")

require("../models/Bancada")
const Bancadas = mongoose.model("bancadas")

require("../models/Horario")
const Horarios = mongoose.model("horarios")

router.get('/', (req, res) => {
    res.render("admin/index")
})


//1. TURMAS

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
        descricao: req.body.descricao,
        subturma: req.body.subturma
    }

    new Turmas(novaTurma).save().then(() => {
        req.flash("success_msg", "Turma criada com sucesso!")
        //console.log("Turma Salva com Sucesso!")
        res.redirect("/admin/turmas")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar a Turma. Tente novamente!")
        //console.log("Erro ao inserir categoria: "+err)
        res.redirect("/admin")
    })
})

router.get("/turmas/edit/:id", (req,res) => {
    
    Turmas.findOne({_id: req.params.id}).then((turma) => {
        res.render("admin/editturmas",{turma: turma})
    }).catch((err) => {
        req.flash("error_msg", "A turma não existe!")
        res.redirect("/admin/turmas")
    })
})

router.post("/turmas/edit", (req,res) => {
    Turmas.findOne({_id: req.body.id}).then((turma) => {
        turma.descricao = req.body.descricao
        turma.subturma = req.body.subturma

        turma.save().then(() => {
            req.flash("success_msg", "Turma editada com sucesso!")
            res.redirect("/admin/turmas")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao salvar a edição da turma")
            res.redirect("/admin/turmas")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao editar turma")
        res.redirect("/admin/turmas")
    })
})

//2. BANCADAS

router.get('/bancadas', (req, res) => {
    Bancadas.find().then((bancadas) => {
        res.render("admin/bancadas",{bancadas: bancadas})
    }).catch((err) => {
        console.log("Houve erro ao listar bancadas!")
        res.redirect("/admin")
    })
})

router.get('/bancadas/add', (req,res) => {
    res.render("admin/addbancada")
})

router.post("/bancadas/nova", (req,res)=> {
    
    const novaBancada = {
        descricao: req.body.descricao
    }
    new Bancadas(novaBancada).save().then(() => {
        req.flash("success_msg", "Bancada criada com sucesso")
        res.redirect("/admin/bancadas")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar bancada. Tente novamente!")
        res.redirect("/admin")
    })
})

//3. HORARIOS
router.get('/horarios', (req,res) => {
    Horarios.find().then((horarios) => {
        res.render("admin/horarios",{horarios: horarios})
    }).catch((err) => {
        console.log("Houve erro ao listar bancada: "+err)
        res.redirect("/admin")
    })
})

router.get('/horarios/add', (req,res) => {
    res.render("admin/addhorarios")
})

router.post("/horarios/novo", (req,res) => {

    const novoHorario = {
        descricao: req.body.descricao
    }

    new Horarios(novoHorario).save().then(() => {
        req.flash("success_msg", "Horario criado com sucesso")
        res.redirect("/admin/horarios")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar horário. Tente novamente!")
        res.redirect("/admin")
    })
})


module.exports = router