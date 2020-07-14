const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require("../models/ReservaImp3D")
const ReservaImp3D = mongoose.model("reservasimp3d")

require("../models/UsuarioImp3D")
const UsuarioImp3D = mongoose.model("usuariosimp3d")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/reservasimp3d", (req, res) => {

    ReservaImp3D.find({ativo: 1}).sort("data").then((reservasimp3d) => {
        res.render("impressora3d/reservasimp3d", {reservasimp3d: reservasimp3d})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/impressora3d/")
    })

})

router.get("/reservasimp3d/add", (req, res) => {

})

router.post("/reservasimp3d/novo", (req, res) => {

}) 

router.get("/reservasimp3d/deletar/:id", (req, res) => {

})

router.get("/reservasimp3d/edit/:id", (req, res) => {

})

router.post("/reservasimp3d/edit", (req, res) => {
    
})



module.exports = router