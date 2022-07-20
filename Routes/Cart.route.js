const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const b_parser = bodyParser.urlencoded({extended: true})
const check = require('express-validator').check;
const {checkAuth} = require('./Guards/checkAuth.guard');
const { 
    getCart, postCart, deleteCart, updateCart, distroyCart 
} = require('../Controllers/Cart.controller');


const checkAmount = 
    check('amount').not().isEmpty().withMessage('amount is required')
    .isInt({min: 1, max: 6}).withMessage('choose from 1 to 6 items')
const checkAmountInCart =
    check('cartAmount').not().isEmpty().withMessage('amount is required')
    .isInt({min: 1}).withMessage('less than 1 are invalid')

router.get( // get all items in cart
    '/',
    checkAuth,
    getCart
)

router.post( // insert one item in cart
    '/',
    b_parser,
    // validation
    checkAmount,
    //
    checkAuth,
    postCart
)

router.post( // delete one item in cart
    '/delete',
    b_parser,
    checkAuth,
    deleteCart
)

router.post( // update one item in cart
    '/update',
    b_parser,
    // validation
    checkAmountInCart,
    //
    checkAuth,
    updateCart
)
// delete all
router.post( // delete all items in cart
    '/delete_all',
    checkAuth,
    distroyCart
)

module.exports = router