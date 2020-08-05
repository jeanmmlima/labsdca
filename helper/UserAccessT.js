const mongoose = require('mongoose')

const model = "ModelName";
const modelDB = "modelindb"

require("../models/"+model)
const Model = mongoose.model(modelDB)

module.exports = {
    UserAccessT: function(req,res,next){

        var flag = 0;
        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        } else {
            if(req.isAuthenticated()){
                Model.findOne({usuario: req.user.id}).then((usuario) => {
                    if(usuario){
                        return next();
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