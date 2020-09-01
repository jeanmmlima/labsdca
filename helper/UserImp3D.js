const mongoose = require('mongoose')

require("../models/UsuarioImp3D")
const UsuarioImp3D = mongoose.model("usuariosimp3d")

module.exports = {
    UserImp3D: function(req,res,next){

        var flag = 0;
        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        } else {
            if(req.isAuthenticated()){
                UsuarioImp3D.findOne({usuario: req.user.id}).then((usuarioimp3d) => {
                    if(usuarioimp3d){
                        if(usuarioimp3d.ativo){
                            return next();
                        } else {
                            req.flash("error_msg", "Usuário não está ativo para fazer reservas. Entrar em contato com a administração do sistema!")
                            return res.redirect("/")
                        }
                    } else {
                        req.flash("error_msg", "Acesso restrito a usuários da impressora 3D ou administradores!")
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