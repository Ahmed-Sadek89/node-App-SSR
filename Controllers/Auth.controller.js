const {validationResult} = require('express-validator');
const {createNewUser, checkLogin} = require('../Models/Auth.model');

exports.getSignupPage = (req, res, next) => {
    let validationErrors = req.flash('validationErrors')
    res.render('signup', {
        validationErrors,
        isAuth: req.session.userId ? true : false,
        
    })
} 
exports.postDataFromSignup = (req, res, next) => {
    let {username, email, password} = req.body
    // return console.log(validationResult(req).array())
    if(validationResult(req).isEmpty()){
        createNewUser(username, email, password)
        .then(() => {
            res.redirect('/login')
        })
        .catch((error) => {
            res.redirect('/signup')
            console.log(error)
        })
    }else{
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/signup')
    }
    
}
exports.getLoginPage = (req, res, next) => {
    let authError = req.flash('authError')[0]
    res.render('login',{
        isAuth: req.session.userId ? true : false,
        authError
    })
}

exports.postDataFromLogin = (req, res, next) => {
    let {email, password} = req.body
    checkLogin(email, password).then(result => {
        req.flash('successAuth', `welcome ${email}`)
        req.session.userId = result.userId;
        req.session.username = result.username;
        req.session.email = result.email;
        req.session.isAdmin = result.isAdmin;
        res.redirect(`/`)
    }).catch(error => {
        console.log(error);
        req.flash('authError', error)
        res.redirect('/login')
    })
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}