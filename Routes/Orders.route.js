const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const b_parser = bodyParser.urlencoded({extended: true})
const check = require('express-validator').check;
const {checkAuth} = require('./Guards/checkAuth.guard');
const {
    getOrders, getVerifyOneOrderPage, getVerifyAllOrdersPage,
    postOneOrderFromCart, postAllOrdersFromCart,
    cancelOneOrder, cancelAllOrders
} = require('../Controllers/Orders.controller')


const checkAddress = 
    check('address').not().isEmpty().withMessage('address is required')
    .isLength({min: 5, max: 20}).withMessage('address must be from 5 to 20 characters')


//// start -> /orders
// get order page
router.get(
    '/',
    checkAuth,
    getOrders
)

// cancel one order
router.post(
    '/cancel',
    b_parser,
    checkAuth,
    cancelOneOrder
)

// cancel all orders
router.post(
    '/cancel_all',
    b_parser,
    checkAuth,
    cancelAllOrders
)
//// end -> /orders


//// start -> orders/verify_order/:cartId
// get verify on order page
router.get(
    '/verify_order/:cartId',
    checkAuth,
    getVerifyOneOrderPage
)

// post one product from cart to orders
router.post(
    '/',
    b_parser,
    checkAddress,
    checkAuth,
    postOneOrderFromCart
)
//// end -> orders/verify_order/:cartId


//// start -> orders/verify_all_orders
// get verify all orders page
router.get(
    '/verify_all_orders',
    checkAuth,
    getVerifyAllOrdersPage
)

// post all products from cart to orders
router.post(
    '/verifyAllOrders',
    b_parser,
    checkAddress,
    checkAuth,
    postAllOrdersFromCart
)

//// end -> orders/verify_all_orders


module.exports = router
