const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

//require models

require("../models/ReservaLabCon")
const ReservaLabCon = mongoose.model("reservaslabcon")

require("../models/Horario")
const Horarios = mongoose.model("horarios")

require("../models/Grupo")
const Grupos = mongoose.model("grupos")

router.get("/reservaslabcon",(req, res) => {
    
    ReservaLabCon.find().populate("horario").populate("grupo").then((reservas) => {
        res.render("usuario/reservaslabcon", {reservas: reservas})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/usuario")
    })

})

router.get("/reservaslabcon/add", (req,res) => {
    
    Grupos.find().then((grupos) => {
        Horarios.find().then((horarios) => {
            res.render("usuario/addreservalabcon",{grupos: grupos,horarios: horarios})
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao listar horários!")
            res.redirect("/usuario")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar grupos!")
        res.redirect("/usuario")
    })

})



module.exports = router