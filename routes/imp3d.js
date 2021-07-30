const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require("../models/ReservaImp3D")
const ReservaImp3D = mongoose.model("reservasimp3d")

require("../models/UsuarioImp3D")
const UsuarioImp3D = mongoose.model("usuariosimp3d")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

const {Admin} =require("../helper/Admin");
const {UserImp3D} = require("../helper/UserImp3D")
const getData = require('../helper/getData')

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

router.get("/reservasimp3d/add", UserImp3D, (req, res) => {

    UsuarioImp3D.find().populate("usuario").then((usuariosimp3d) => {
        res.render("imp3d/addreservasimp3d", {usuariosimp3d: usuariosimp3d})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro porcurar usuários impressora 3D reservas!")
        res.redirect("/imp3d/reservasimp3d/")
    })

})

router.post("/reservasimp3d/novo", UserImp3D, (req, res) => {

    //corrigindo formato da data
    var d = getData(req.body.data);
    var today = getData(new Date());

   if (d.getTime() < today.getTime()){
        req.flash("error_msg", "Data escolhida não pode ser anterior a data atual (óbvio rs)! Por favor, escolher outra data")
        res.redirect("/imp3d/reservasimp3d/add"); 
    } else {
        ReservaImp3D.findOne({data: d}).then((reserva) => {
            if(reserva){
                req.flash("error_msg", "Impressora 3D já foi reservada na data escolhida! Por favor, escolher outra data")
                res.redirect("/imp3d/reservasimp3d/add"); 
            } 
            else {
                const novaRerservaImp3d = {
                    usuario3d: req.body.usuario3d,
                    data: d,
                    comentario: req.body.comentario
                }
            
                new ReservaImp3D(novaRerservaImp3d).save().then(() => {
            
                    req.flash("success_msg", "Reserva realizada com sucesso!")
                    res.redirect("/imp3d/reservasimp3d")
            
                }).catch((err) => {
                    req.flash("error_msg", "Houve erro ao realizar reserva!")
                    res.redirect("/imp3d/reservasimp3d/")
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao buscar reserva. Tente novamente!")
            console.log("Erro: "+err)
            res.redirect("/imp3d/reservasimp3d")
        })
    }

}) 

router.get("/reservasimp3d/deletar/:id", UserImp3D, (req, res) => {
    ReservaImp3D.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Reserva excluída com sucesso!")
        res.redirect("/imp3d/reservasimp3d")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao tentar excluir reserva!")
        res.redirect("/imp3d/reservasimp3d")
    })

})

router.get("/reservasimp3d/edit/:id", UserImp3D, (req, res) => {

    ReservaImp3D.findOne({_id: req.params.id}).then((reserva) => {
        UsuarioImp3D.find().populate("usuario").then((usuariosimp3d) => {
            res.render("imp3d/editreservasimp3d", {reservaimp3d: reserva, usuariosimp3d: usuariosimp3d})
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao listar usuários impressora 3D!")
            res.redirect("/imp3d/reservasimp3d")
        })
        
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao buscar reserva!")
        res.redirect("/imp3d/reservasimp3d")
    })

})

router.post("/reservasimp3d/edit", UserImp3D, (req, res) => {

    var d = getData(req.body.data);
    var today = getData(new Date());

    if(d.getTime() < today.getTime()){
        req.flash("error_msg", "Data escolhida não pode ser anterior a data atual (óbvio rs)! Por favor, escolher outra data")
        res.redirect("/imp3d/reservasimp3d/");
    }
    else {
        ReservaImp3D.findOne({data: d}).then((reserva) => {
            if(reserva){
                req.flash("error_msg", "Impressora 3D já foi reservada na data escolhida! Por favor, escolher outra data")
                res.redirect("/imp3d/reservasimp3d/"); 
            }
            else {
    
                ReservaImp3D.findOne({_id: req.body.id}).then((reservaimp3d) => {
                    reservaimp3d.usuario3d = req.body.usuario3d,
                    reservaimp3d.data = d,
                    reservaimp3d.comentario = req.body.comentario
            
                    reservaimp3d.save().then(() => {
                        req.flash("success_msg", "Reserva alterada com sucesso!")
                        res.redirect("/imp3d/reservasimp3d")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve erro ao alterar reserva!")
                        res.redirect("/imp3d/reservasimp3d")    
                    })
                }).catch((err) => {
                    req.flash("error_msg", "Houve erro ao buscar reserva!")
                    res.redirect("/imp3d/reservasimp3d")
                })
    
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno. Comunicar ao administrador do sistema!")
            res.redirect("/")
        })
    }

 

    
})

router.get("/usuariosimp3d", Admin, (req, res) => {
    UsuarioImp3D.find().populate("usuario").then((usuariosimp3d) => {
        res.render("imp3d/usuariosimp3d", {usuariosimp3d: usuariosimp3d});
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar usuarios da impressora 3D!")
        res.redirect("/home/")
    })
})

router.get("/usuariosimp3d/add", Admin, (req, res) => {
    Usuario.find().then((usuarios) => {
        res.render("imp3d/addusuariosimp3d", {usuarios: usuarios})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar usuarios!")
        res.redirect("/home/")
    })
})

router.post("/usuariosimp3d/novo", Admin, (req, res) => {

    if(req.body.usuario == null){
        req.flash("error_msg", "Usuario não informado!")
        res.redirect("/imp3d/usuariosimp3d/")
    }

    const novoUsuarioImp3D = {
        usuario: req.body.usuario,
        comentario: req.body.comentario
    }

    new UsuarioImp3D(novoUsuarioImp3D).save().then(() => {
        req.flash("success_msg", "Usuario da impressora 3D registrado com sucesso!")
        res.redirect("/imp3d/usuariosimp3d")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar usuário!")
        res.redirect("/admin")
    })
})


router.get("/usuariosimp3d/deletar/:id", Admin, (req, res) => {
   
        /*
        ReservaImp3D.deleteMany({usuario3d: req.params.id}).then(() => {
            UsuarioImp3D.deleteOne({_id: req.params.id}).then(() => {
                req.flash("success_msg", "Usuário Impressora 3D excluído com sucesso!")
                res.redirect("/imp3d/usuariosimp3d")
            }).catch((err) => {
                req.flash("error_msg", "Erro interno ao excluir usuário!")
                res.redirect("/imp3d/usuariosimp3d")
            });
        }).catch((err) => {
            req.flash("error_msg", "Erro interno ao excluir dependencias do usuário!")
            res.redirect("/imp3d/usuariosimp3d")
        })
        */

        UsuarioImp3D.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Usuário Impressora 3D excluído com sucesso!")
            res.redirect("/imp3d/usuariosimp3d")
        }).catch((err) => {
            console.log(err);
            req.flash("error_msg", "Erro interno ao excluir usuário!")
            res.redirect("/imp3d/usuariosimp3d")
        });
        
})

router.get("/usuariosimp3d/ativar/:id", Admin, (req, res) => {
    UsuarioImp3D.findOne({_id: req.params.id}).then((usuarioimp3d) => {

        usuarioimp3d.ativo = 1;
        usuarioimp3d.save().then(() => {
            req.flash("success_msg", "Usuário Impressora 3D ativado com sucesso!")
            res.redirect("/imp3d/usuariosimp3d")
        }).catch((err) => {
            req.flash("error_msg", "Erro interno ao ativar usuário!")
            res.redirect("/imp3d/usuariosimp3d")
        })
        
    }).catch((err) => {
        req.flash("error_msg", "Erro interno ao excluir usuário!")
        res.redirect("/imp3d/usuariosimp3d")
    })
})

router.get("/usuariosimp3d/edit/:id", Admin, (req, res) => {
    UsuarioImp3D.findOne({_id: req.params.id}).then((usuarioimp3d) => {
        Usuario.find().then((usuarios) => {
            res.render("imp3d/editusuariosimp3d",
            {usuarioimp3d: usuarioimp3d,
            usuarios: usuarios})
        }).catch((err) => {
            req.flash("error_msg", "Não conseguiu listar usuários")
            res.redirect("/imp3d/usuariosimp3d")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não conseguiu encontrar o Usuário da Impressora 3D")
        res.redirect("/imp3d/usuariosimp3d")
    })
})

router.post("/usuariosimp3d/edit/", Admin, (req, res) => {
    UsuarioImp3D.findOne({_id: req.body.id}).then((usuarioimp3d) => {
        
        usuarioimp3d.usuario = req.body.usuario,
        usuarioimp3d.comentario = req.body.comentario

        usuarioimp3d.save().then(() => {
            req.flash("success_msg", "Usuário Impressora 3D editado com sucesso")
            res.redirect("/imp3d/usuariosimp3d")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao editar usuário impressora 3D")
            res.redirect("/imp3d/usuariosimp3d")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não foi possível encontrar o usuário impressora 3D")
        res.redirect("/imp3d/usuariosimp3d")
    })
})


module.exports = router