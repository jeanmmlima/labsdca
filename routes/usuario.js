const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const passport = require("passport")
const async = require("async")
const crypto = require('crypto')
const nodemailer = require("nodemailer")
const xoauth2 = require('xoauth2');
const bcrypt = require('bcryptjs')

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

require("../models/AlunoLabCon")
const AlunosLabCon = mongoose.model("alunoslabcon")

var moment = require('moment')

router.get("/reservaslabcon",(req, res) => {
    //population em multiniveis de relacionamento
    //population across multi-level 
    if(req.isAuthenticated()){
        AlunosLabCon.findOne({usuario: req.user._id}).then((aluno) => {
            ReservaLabCon.find({ativo: 1}).sort("data").populate("horario").populate({
                path: "grupo",
                populate: {path: "turma"}
            }).then((reservas) => {
                res.render("usuario/reservaslabcon", {reservas: reservas, aluno: aluno})
            }).catch((err) => {
                req.flash("error_msg", "Houve erro ao listar reservas!")
                res.redirect("/usuario/")
            })
        }).catch((err) => {
            console.log("não encontrou "+err)
        })
    } else {
    ReservaLabCon.find({ativo: 1}).sort("data").sort("horario").populate("horario").populate({
        path: "grupo",
        populate: {path: "turma"}
    }).then((reservas) => {
        res.render("usuario/reservaslabcon", {reservas: reservas})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar reservas!")
        res.redirect("/usuario/")
    })
    }
})
router.get("/reservaslabcon/add", (req,res) => {

    if(req.isAuthenticated()){
        Grupos.find().populate("turma").then((grupos) => {
            Horarios.find().then((horarios) => {
                res.render("usuario/addreservalabcon",{grupos: grupos,horarios: horarios})
            }).catch((err) => {
                req.flash("error_msg", "Houve erro ao listar horários!")
                res.redirect("/usuario/reservaslabcon")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao listar grupos!")
            res.redirect("/usuario/reservaslabcon")
        })
    } else {
        req.flash("error_msg", "Você precisa estar logado para cadastrar uma reserva!")
        res.redirect("/usuario/reservaslabcon")
    }
    
   

})

router.post("/reservaslabcon/novo", (req,res) => {

    //corrige time zone offset

    //var d = new Date(req.body.data);
    //  var picked_data = new Date(r);
    var fd = moment(req.body.data).format('DD/MM/YYYY');
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

    if(req.isAuthenticated() && req.user.admin == 0){
        AlunosLabCon.findOne({usuario: req.user._id}).then((aluno) => {
            ReservaLabCon.findOne({_id: req.params.id}).then((reserva) => {
                if(aluno.grupo.equals(reserva.grupo)){
                    ReservaLabCon.deleteOne({_id: req.params.id}).then(() => {
                        req.flash("success_msg", "Reserva excluída com sucesso!")
                        res.redirect("/usuario/reservaslabcon")
                    }).catch((err) => {
                        req.flash("error_msg", "Houve erro ao excluir a reserva! Tente novamente!")
                        res.redirect("/usuario/reservaslabcon")
                    })
                } else {
                    req.flash("error_msg", "Usuário só pode excluir reservas do seu grupo!")
                    res.redirect("/usuario/reservaslabcon")
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve erro procurar a reserva selecionada!")
                res.redirect("/usuario/")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve erro procurar usuário aluno!")
            res.redirect("/usuario/")
        })
    } else if(req.isAuthenticated && req.user.admin == 1){
        ReservaLabCon.deleteOne({_id: req.params.id}).then(() => {
            req.flash("success_msg", "Reserva excluída com sucesso!")
            res.redirect("/usuario/reservaslabcon")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro ao excluir a reserva! Tente novamente!")
            res.redirect("/usuario/reservaslabcon")
        })
    } else {
        req.flash("error_msg", "Usuário precisa estar logado para executar excluir reservas! Tente novamente!")
        res.redirect("/usuario/reservaslabcon")
    }

    

})

router.get("/reservaslabcon/edit/:id", (req, res) => {

    if(req.isAuthenticated() && req.user.admin == 0){
        AlunosLabCon.findOne({usuario: req.user._id}).then((aluno) => {
            ReservaLabCon.findOne({_id: req.params.id}).then((reserva) => {
                if(aluno.grupo.equals(reserva.grupo)){
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
                } else {
                    req.flash("error_msg", "Usuário só pode editar reservas do seu grupo!")
                    res.redirect("/usuario/reservaslabcon")
                }
            }).catch((err) => {
                req.flash("error_msg", "Houve erro procurar a reserva selecionada!")
                res.redirect("/usuario/reservaslabcon")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve erro procurar aluno logado!")
            res.redirect("/usuario/reservaslabcon")
        })
    } else if(req.isAuthenticated() && req.user.admin == 1){
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
    } else {
        req.flash("error_msg", "Usuário precisa estar logado para executar editar reservas! Tente novamente!")
        res.redirect("/usuario/reservaslabcon")
    }

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
    
    passport.authenticate('local', {

        successRedirect: "/",
        failureRedirect: "/usuario/login",
        badRequestMessage : 'Missing username or password.',
        failureFlash: true,
        successFlash: true,            
        failureFlash: req.flash("error_msg",'Usuário ou senha inválidos! Tente novamente.')
    })(req, res,next)
 
})

router.get("/logout", (req,res) => {
    req.logout()
    req.flash("sucess_msg", "Deslogado com sucesso")
    res.redirect("/")
})

//Esqueceu a senha

router.get("/forgot", (req, res) => {
    res.render("usuario/forgot")
})

router.post("/forgot/edit", (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err,token);
            });
        },
        function(token, done){
            Usuarios.findOne({email: req.body.email}, function(err, user) {
                if(!user){
                    req.flash("error_msg", "Nenhuma conta encontrada com este endereço de email")
                    return res.redirect("/usuario/forgot")
                }
                user.token_senha = token;

                user.save(function(err) {
                    done(err,token,user);
                });
            });
        },
        function(token, user, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'email@gmail.com',
                  pass: 'senha'
                }
              })
            /*
           let smtpTransport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: 'user@example.com',
                clientId: '000000000000-xxx0.apps.googleusercontent.com',
                clientSecret: 'XxxxxXXxX0xxxxxxxx0XXxX0',
                refreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
                accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x'
            }
        });*/
            var mailOptions = {
                to: user.email,
                from: 'DCA Labs',
                subject: 'Alteração de Senha - DCALabs',
                text: 'Olá \n\n' + 
                'Você está recebendo esse e-mail porque você (ou alguém) solicitou alteração de senha da sua conta.\n\n' +
                'Por favor, clique no link abaixo para completar o processo de alteração de senha:\n\n' +
                'http://' + req.headers.host + '/usuario/reset/' + token + '\n\n' +
                'Se você não requisitou a mudança, por favor ingorar o e-mail.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash("success_msg", "Um email foi enviado para "+user.email+" com instruções para alteração da senha!");
                done(err, 'done');
            });
        }
        
    ], function(err) {
        if(err) return next(err);
        res.redirect('/')
    });
});

router.get("/reset/:token", (req, res) => {
    Usuarios.findOne({token_senha: req.params.token}, function(err, usuario) {
        if(!usuario){
            req.flash("error_msg","O token de alteração de senha é inválido!");
            return res.redirect("/")
        }
        res.render("usuario/reset", {usuario: usuario})
    })
})

router.post("/reset/edit", (req, res) => {
    async.waterfall([
        function(done){
            Usuarios.findOne({_id: req.body.id}, function(err,usuario){
                if(!usuario){
                    req.flash("error_msg", "Usuário não foi encontrado")
                    return res.redirect("/")
                }
                if(req.body.senha.toString().length < 4){
                    req.flash("error_msg", "Senha deve conter no mínimo 4 caracteres!")
                    res.redirect("/")
                } 
                else if(req.body.senha == req.body.senha2){
                    usuario.senha = req.body.senha;
                    usuario.token_senha = undefined;

                    bcrypt.genSalt(10,(erro,salt) => {

                        bcrypt.hash(usuario.senha,salt,(erro,hash) => {
                            if(erro){
                                req.flash("error_msg", "Houve erro durante salvamento o usuario!")
                                req.redirect("/")
                            } else {
                                usuario.senha = hash
                                usuario.save(function(err) {
                                    req.logIn(usuario, function(err) {
                                        done(err, usuario);
                                      });
                                })
                            }
                        })
        
                    })
                }
                else {
                    req.flash("error_msg", "Senhas não conferem. Devem ser iguais")
                    res.redirect("/")
                }
            });
        },
        function(usuario, done){
            var smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'email@gmail.com',
                  pass: 'senha'
                }
              })
            var mailOptions = {
                to: usuario.email,
                from: 'DCA Labs',
                subject: 'Senha atualizada - DCALabs',
                text: 'Olá,\n\n' +
                'Confirmamos que a senha para a conta ' + usuario.email + ' foi alterada com sucesso!.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash("success_msg", "Sua senha foi alterada com sucesso!");
                done(err, 'done');
            });
        }
    ], function(err){
        res.redirect("/")
    })
})

module.exports = router