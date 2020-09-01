const mongoose = require('mongoose')

require("../models/AlunoLabCon")
const AlunoLabCon = mongoose.model("alunoslabcon")

module.exports = {
    UserLabCon: function(req,res,next){

        var flag = 0;
        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        } else {
            if(req.isAuthenticated()){
                AlunoLabCon.findOne({usuario: req.user.id}).then((alunolabcon) => {
                    if(alunolabcon){
                        if(alunolabcon.ativo){
                            return next();
                        } else {
                            req.flash("error_msg", "Usuário não está ativo para fazer reservas. Entrar em contato com a administração do sistema!")
                            return res.redirect("/")
                        }
                    } else {
                        req.flash("error_msg", "Acesso restrito a usuários do Laboratório de Controle ou Administradores!")
                        return res.redirect("/")
                    }
                }).catch((err) => {
                    console.log("Erro ao fazer busca: "+err)
                })
                
            } else {
                req.flash("error_msg", "Acesso restrito a usuários autenticados!")
                return res.redirect("/")
            }
            
        }
        
        

    }
}