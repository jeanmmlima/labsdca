module.exports = {
    Admin: function(req,res,next){

        if(req.isAuthenticated() && req.user.Admin == 1){
            return next();
        }
        req.flash("error_msg", "Voce precisa ser admin!")
        res.redirect("/")

    }
}