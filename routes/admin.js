const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')

const passport = require("passport")
const bcrypt = require('bcryptjs')

//require models

require("../models/Turma")
const Turmas = mongoose.model("turmas")

require("../models/Bancada")
const Bancadas = mongoose.model("bancadas")

require("../models/Horario")
const Horarios = mongoose.model("horarios")

require("../models/Grupo")
const Grupos = mongoose.model("grupos")

require("../models/AulaLabCon")
const AulasLabCon = mongoose.model("aulaslabcon")

require("../models/Usuario")
const Usuarios = mongoose.model("usuarios")


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

router.get('/turmas/deletar/:id', (req, res) => {
    Turmas.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Turma deletada com sucesso!")
        res.redirect("/admin/turmas")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar a turma!")
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

router.get('/bancadas/edit/:id', (req, res) => {
    Bancadas.findOne({_id: req.params.id}).then((bancada) => {
        res.render("admin/editbancadas", {bancada: bancada})
    }).catch((err) => {
        req.flash("error_msg", "Esta bancada nao existe")
        res.redirect("/admin/bancadas")
    })
})

router.post("/bancadas/edit", (req, res) => {
    Bancadas.findOne({_id: req.body.id}).then((bancada) => {
        bancada.descricao = req.body.descricao

        bancada.save().then(() => {
            req.flash("success_msg", "Bancada alterada com sucesso!")
            res.redirect("/admin/bancadas")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao salvar bancada")
            res.redirect("/admin/bancadas")
        }).catch((err) => {
            req.flash("error_msg","Houve erro ao editar bancada")
            res.redirect("/admin/bancadas")
        })
    })
})

router.post("/bancadas/deletar", (req, res) => {
    Bancadas.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Bancada excluída com sucesso!")
        res.redirect("/admin/bancadas")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao excluir bancada!")
        res.redirect("/admin/bancadas")
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

router.get('/horarios/edit/:id', (req, res) => {
    Horarios.findOne({_id: req.params.id}).then((horario) => {
        res.render("admin/edithorarios", {horario: horario})
    }).catch((err) => {
        req.flash("error_msg", "Este horário não existe")
        res.redirect("/admin/horarios")
    })
})

router.post("/horarios/edit", (req, res) => {
    Horarios.findOne({_id: req.body.id}).then((horario) => {
        horario.descricao = req.body.descricao

        horario.save().then(() => {
            req.flash("success_msg", "Horário alterada com sucesso!")
            res.redirect("/admin/horarios")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao salvar horário")
            res.redirect("/admin/horarios")
        }).catch((err) => {
            req.flash("error_msg","Houve erro ao editar Horários")
            res.redirect("/admin/horarios")
        })
    })
})

router.get('/horarios/deletar/:id', (req, res) => {
    Horarios.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Horário excluído com sucesso!")
        res.redirect("/admin/horarios")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao excluir horário!")
        res.redirect("/admin/horarios")
    })
})


//Grupos 
router.get("/grupos", (req,res) => {

    Grupos.find().populate("bancada").populate("turma").then((grupos) => {
        res.render("admin/grupos",{grupos: grupos})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar Grupos!")
        res.redirect("/admin")
    })

})

router.get("/grupos/add", (req,res) => {
    
    Bancadas.find().then((bancadas) => {
        Turmas.find().then((turmas) => {
            res.render("admin/addgrupos",{bancadas: bancadas, turmas: turmas})
        }).catch((err) => {
            req.flash("error_msg", "Houve erro carregar Turmas")
            res.redirect("/admin")    
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve erro carregar Bancadas")
        res.redirect("/admin")
    })
})

router.post("/grupos/novo", (req,res) => {

    const novoGrupo = {
        descricao: req.body.descricao,
        bancada: req.body.bancada,
        turma: req.body.turma
    } 
    
    new Grupos(novoGrupo).save().then(() => {
        req.flash("success_msg", "Grupo criado com sucesso!")
        res.redirect("/admin/grupos")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao salvar o grupo. Tente novamente!")
        res.redirect("/admin/grupos")
    })

})

router.get("/grupos/edit/:id", (req,res) => {
    Grupos.findOne({_id: req.params.id}).then((grupo) => {
        Bancadas.find().then((bancadas) => {
            Turmas.find().then((turmas) => {
                res.render("admin/editgrupos", 
                {grupo: grupo, 
                 bancadas: bancadas, 
                 turmas: turmas})
            }).catch((err) => {
                req.flash("error_msg", "Não conseguiu listar turmas")
                console.log("Erro: "+err)
                res.redirect("/admin/grupos")
            })
        }).catch((err) => {
            req.flash("error_msg", "Não conseguiu listar bancadas")
            res.redirect("/admin/grupos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não conseguiu encontrar o grupo")
        res.redirect("/admin/grupos")
    })
})

router.post("/grupos/edit/", (req, res) => {
    Grupos.findOne({_id: req.body.id}).then((grupo) => {

        grupo.descricao = req.body.descricao,
        grupo.bancada = req.body.bancada,
        grupo.turma = req.body.turma

        grupo.save().then(() => {
            req.flash("success_msg", "Grupo editado com sucesso!")
            res.redirect("/admin/grupos")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao editar o grupo")
            res.redirect("/admin/grupos")
        })
    }).catch((err) => {
        console.log("Erro: "+err)
        req.flash("error_msg", "Houve erro ao editar grupo")
        res.redirect("/admin/grupos")
    })
})

router.get("/grupos/deletar/:id", (req,res) => {
    Grupos.remove({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Grupo deletado com sucesso!")
        res.redirect("/admin/grupos")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao deletar grupo")
        res.redirect("/admin/grupos")
    })
})


//AULAS
router.get("/aulaslabcon", (req, res) => {
    AulasLabCon.find().populate("horario").then((aulaslabcon) => {
        res.render("admin/aulaslabcon",{aulaslabcon: aulaslabcon})
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao listar aulas!")
        res.redirect("/admin")
    })
})

router.get('/aulaslabcon/add', (req,res) => {
    
    Horarios.find().then((horarios) => {
        res.render("admin/addaulaslabcon", {horarios: horarios});
        
        //res.json(horarios);
        
    }).catch((err) => {
        req.flash("error_msg", "Houve erro carregar horários")
        res.redirect("/admin")
    })
})

router.post("/aulaslabcon/novo", (req,res) => {

    const novoAulaLabCon = {
        horario: req.body.horario,
        dia_semana: req.body.dia_semana,
        comentario: req.body.comentario
    } 
    
    new AulasLabCon(novoAulaLabCon).save().then(() => {
        req.flash("success_msg", "Horário de aula cadastrado com sucesso!")
        res.redirect("/admin/aulaslabcon")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao cadastrar horário de aula. Tente novamente!")
        res.redirect("/admin/aulaslabcon")
    })

})

router.get("/aulaslabcon/edit/:id", (req,res) => {
    AulasLabCon.findOne({_id: req.params.id}).then((aula) => {
        Horarios.find().then((horarios) => {
                res.render("admin/editaulaslabcon", 
                {aula: aula, 
                 horarios: horarios})
        }).catch((err) => {
                req.flash("error_msg", "Não conseguiu listar horários")
                res.redirect("/admin/aulaslabcon")
        })
    }).catch((err) => {
        req.flash("error_msg", "Não conseguiu encontrar a aula")
        res.redirect("/admin/aulaslabcon")
    })
})

router.post("/aulaslabcon/edit/", (req, res) => {
    AulasLabCon.findOne({_id: req.body.id}).then((aula) => {

        aula.dia_semana = req.body.dia_semana,
        aula.horario = req.body.horario,
        aula.comentario = req.body.comentario

        aula.save().then(() => {
            req.flash("success_msg", "Aula editada com sucesso!")
            res.redirect("/admin/aulaslabcon")
        }).catch((err) => {
            req.flash("error_msg", "Houve erro interno ao editar a aula")
            res.redirect("/admin/aulaslabcon")
        })
    }).catch((err) => {
        console.log("Erro: "+err)
        req.flash("error_msg", "Houve erro ao editar aula")
        res.redirect("/admin/aulaslabcon")
    })
})



router.get("/aulaslabcon/deletar/:id", (req,res) => {
    AulasLabCon.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Aula deletada com sucesso!")
        res.redirect("/admin/aulaslabcon")
    }).catch((err) => {
        req.flash("error_msg", "Houve erro ao deletar aula")
        res.redirect("/admin/aulaslabcon")
    })
})


// Registro de usuário
router.get("/registro", (req, res) => {
    res.render("admin/registro")
})

router.post("/registro", (req, res) => {

    if(req.body.senha < 4){
        req.flash("error_msg", "Senha deve conter mínimo de 4 caracteres")
        res.redirect("/admin/registro")
    }
    else if(req.body.senha != req.body.senha2){
        req.flash("error_msg", "Senha são diferentes")
        res.redirect("/admin/registro")
    }
    else {

        Usuarios.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com esse email no sistema")
                res.redirect("/admin/registro")
            } else {
                const novoUsuario = new Usuarios({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                bcrypt.genSalt(10,(erro,salt) => {
                    bcrypt.hash(novoUsuario.senha,salt,(erro,hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve erro durante salvamento o usuario!")
                            eq.redirect("/")
                        } else {
                            novoUsuario.senha = hash
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário criado com sucesso!")
                                res.redirect("/")
                            }).catch((erro) => {
                                req.flash("error_msg", "Erro ao criar usuário")
                                res.redirect("/admin/registro")
                            })
                        }
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Erro interno ao procurar usuario")
            res.redirect("/admin")
        })

    }

})

router.get('/labcontrole',(req,res)=> {
    res.render("admin/labcontrole")
})

module.exports = router