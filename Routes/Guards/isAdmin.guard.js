exports.isAdmin = (req, res, next) => {
    if(req.session.isAdmin){ // is already authenticated
        next()
    }else{
        res.redirect('/')
    }
}