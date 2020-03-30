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
    //population em multiniveis de relacionamento
    //population across multi-level 
    ReservaLabCon.find().populate("horario").populate({
        path: "grupo",
        populate: {path: "turma"}
    }).then((reservas) => {
        res.render("usuario/reservaslabcon", {reservas: reservas})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/usuario")
    })

})

router.get("/reservaslabcon/add", (req,res) => {
    
    Grupos.find().populate("turma").then((grupos) => {
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

router.post("/reservaslabcon/novo", (req,res) => {

    //corrige time zone offset
    var d = new Date(req.body.data);
    d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );

    const novaReservaLabCon = {
        grupo: req.body.grupo,
        horario: req.body.horario,
        data: d
    }
    new ReservaLabCon(novaReservaLabCon).save().then(() => {
        req.flash("success_msg", "Reserva realizada com sucesso!")
        res.redirect("/usuario/reservaslabcon")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar a reserva! Tente novamente!")
        console.log("Erro ao inserir dado: "+err)
        res.redirect("/usuario/reservaslabcon")
    })

})

router.get("/reservaslabcon/deletar/:id", (req, res) => {

    ReservaLabCon.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Reserva excluída com sucesso!")
        res.redirect("/usuario/reservaslabcon")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao excluir a reserva! Tente novamente!")
        res.redirect("/usuario/reservaslabcon")
    })

})

router.get("/reservaslabcon/edit/:id", (req, res) => {
    ReservaLabCon.findOne({_id: req.params.id}).then((reservalabcon) => {
        Grupos.find().populate("turma").then((grupos) => {
            Horarios.find().then((horarios) => {
                res.render("usuario/editreservaslabcon",{
                    reservalabcon: reservalabcon,
                    grupos: grupos,
                    horarios: horarios
                })
            }).catch((err) => {
                req.flash("error_msg", "Houve erro ao listar horários")
                res.redirect("/usuario/reservaslabcon")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao grupos")
            res.redirect("/usuario/reservaslabcon")
        })
    }).catch((err) => {
        req.flash("error_msg", "A reserva não foi encontrada!")
        res.redirect("/usuario/reservaslabcon")
    })
})

router.post("/reservaslabcon/edit", (req, res) => {

    ReservaLabCon.findOne({_id: req.body.id}).then((reservalabcon) => {

        var d = new Date(req.body.data);
        d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
        
        reservalabcon.grupo = req.body.grupo,
        reservalabcon.horario = req.body.horario,
        reservalabcon.data = d

        reservalabcon.save().then(() => {
            req.flash("success_msg", "Reserva editada com sucesso!")
            res.redirect("/usuario/reservaslabcon")
        }).catch((err) => {
            req.flash("error_msg", "erro interno ao salvar edição da reserva!")
            res.redirect("/usuario/reservaslabcon")    
        })

    }).catch((err) => {
        req.flash("error_msg", "A reserva não foi encontrada!")
        res.redirect("/usuario/reservaslabcon")
    })

})

module.exports = router