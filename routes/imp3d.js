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

    ReservaImp3D.find({ativo: 1}).sort("data").populate({
        path: "usuario3d",
        populate: {path: "usuario"}
    }).then((reservasimp3d) => {
        res.render("imp3d/reservasimp3d", {reservasimp3d: reservasimp3d})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/home/")
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

router.get("/usuariosimp3d", (req, res) => {
    UsuarioImp3D.find({ativo: 1}).populate("usuario").then((usuariosimp3d) => {
        res.render("imp3d/usuariosimp3d", {usuariosimp3d: usuariosimp3d});
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar usuarios da impressora 3D!")
        res.redirect("/home/")
    })
})

router.get("/usuariosimp3d/add", (req, res) => {
    Usuario.find().then((usuarios) => {
        res.render("imp3d/addusuariosimp3d", {usuarios: usuarios})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar usuarios!")
        res.redirect("/home/")
    })
})



module.exports = router