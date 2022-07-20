exports.isAuth = (req, res, next) => {
    if(req.session.userId){ // is already authenticated
        res.redirect('/')
    }else{
        next()
    }
}