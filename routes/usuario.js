const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const passport = require("passport")

//require models

require("../models/ReservaLabCon")
const ReservaLabCon = mongoose.model("reservaslabcon")

require("../models/Horario")
const Horarios = mongoose.model("horarios")

require("../models/Grupo")
const Grupos = mongoose.model("grupos")

require("../models/Bancada")
const Bancadas = mongoose.model("bancadas")

require("../models/AulaLabCon")
const AulasLabCon = mongoose.model("aulaslabcon")

require("../models/Usuario")
const Usuarios = mongoose.model("usuarios")

var moment = require('moment')

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
        res.redirect("/usuario/")
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

    //var d = new Date(req.body.data);
    //  var picked_data = new Date(r);
    var fd = moment(req.body.data).format('DD/MM/YYYY');
    console.log(fd);
    var d = new Date(req.body.data);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    d.setHours(0);
    d.setMinutes(0);
    d.setMilliseconds(0);
    d.setSeconds(0);


    AulasLabCon.findOne({horario: req.body.horario, dia_semana: d.getDay()}).then((aula) => {
        if(aula){
            req.flash("error_msg", "Laboratório em aula no horário e data escolhidos!")
            res.redirect("/usuario/reservaslabcon/add");
        } else {

            //verifica a bancada do grupo que tenta reservar
            var bancada;
            Grupos.findOne({_id: req.body.grupo}).then((grupo) => {
                bancada = grupo.bancada;
            }).catch((err) => {
                console.log("Não pode encontrar o grupo")
            })

            /*
            Revifica se a bancada já está reservada para o mesmo horario e dia
            se tiver, não cadastra reserva (flag 1). Se estiver disponivel
            cadastra a reserva (flag 0).
            */


            ReservaLabCon.find({data: d, horario: req.body.horario}).populate("grupo").then((reservas) => {
            
                var i, flag = 0;
                for(i = 0; i < reservas.length; i++){
                    if(reservas[i].grupo.bancada.equals(bancada)){
                        flag = 1;
                        break;
                    }
                    
                }
                if(flag){
                    //console.log("Flag: "+flag+ " NÃO PODE RESERVAR");
                    req.flash("error_msg", "Reserva já existe para data e horario escolhidos. Escolher outra data ou horário");
                    res.redirect("/usuario/reservaslabcon/add")
                } else {
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
                        res.redirect("/usuario/reservaslabcon")
                    })
                }

            }).catch((err) => {
                req.flash("error_msg", "Houve erro ao buscar reserva. Tente novamente!")
                res.redirect("/usuario/reservaslabcon")
            })


        }   
    }).catch((err) => {
        console.log("Erro ao procurar aula: "+err);
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

//Login

router.get("/login", (req,res) => {
    res.render("usuario/login")
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {

        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res,next)
})

router.get("/logout", (req,res) => {
    req.logout()
    req.flash("sucess_msg", "Deslogado com sucesso")
    res.redirect("/")
})


module.exports = router