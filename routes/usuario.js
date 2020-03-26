const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require("../models/ReservaLabCon")
const ReservaLabCon = mongoose.model("reservaslabcon")

router.get("/reservaslabcon",(req, res) => {
    
    ReservaLabCon.find().populate("horario").populate("grupo").then((reservas) => {
        res.render("usuario/reservaslabcon", {reservas: reservas})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/usuario")
    })

})



module.exports = router