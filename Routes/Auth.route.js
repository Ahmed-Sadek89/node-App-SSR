// required modules
const {Router} = require('express');
const router = Router();
const body_parser = require('body-parser');
const b_parser = body_parser.urlencoded({extended: true});
const {check} = require('express-validator')
const { 
    getSignupPage,
    postDataFromSignup, 
    getLoginPage, 
    postDataFromLogin,
    getLogout
} = require('../Controllers/Auth.controller')
const {isAuth} = require('./Guards/isAuth.guard')

// make validation for inputs and send it to controller
let check_username = 
    check('username')
    .not().isEmpty().withMessage('username is required')
    .isLength({min: 3, max: 15}).withMessage('username must be from 3 to 15 characters')
    let check_email = 
    check('email')
    .not().isEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email, missing "@"')
let check_password = 
    check('password')
    .not().isEmpty().withMessage('password is required')
    .isLength({min: 3, max: 15}).withMessage('password characters must be from 3 to 15 characters');
let check_confirmPassword = 
    check('confirmPassword').custom((value, {req}) => {
        if(value === req.body.password){
            return true
        }else{
            throw 'password do not match'
        }
    });

// routers
router.get('/signup', isAuth, getSignupPage);
router.post(
    '/signup', 
    isAuth,
    b_parser,
    // validation
    check_username,
    check_email, 
    check_password,
    check_confirmPassword,
    // controller
    postDataFromSignup
);
router.get('/login', isAuth, getLoginPage);
router.post(
    '/login', 
    isAuth, 
    b_parser, 
    postDataFromLogin
);
router.all('/logout', getLogout);


module.exports = router