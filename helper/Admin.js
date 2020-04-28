module.exports = {
    Admin: function(req,res,next){

        if(req.isAuthenticated() && req.user.admin == 1){
            return next();
        }
        req.flash("error_msg", "Acesso restrito!")
        res.redirect("/")

    }
}