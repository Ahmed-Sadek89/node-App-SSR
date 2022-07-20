const { validationResult } = require('express-validator');
const moment = require('moment');
const {
    displayAllProductInOrder, addOneProductInOrders, addAllProductsInOrders,
    cancelOneOrder, distroyAllOrders
} = require('../Models/Orders.model')
//// -> /orders
// get order page
exports.getOrders = (req, res) => {
    const {userId} = req.session;
    const createOneOrderSuccess = req.flash('createOneOrderSuccess')[0]
    const createAllOrdersSuccess = req.flash('createAllOrdersSuccess')[0]
    const cancelOneOrderSuccess = req.flash('cancelOneOrderSuccess')[0];
    const cancelAllOrdersSuccess = req.flash('cancelAllOrdersSuccess')[0]

    displayAllProductInOrder(userId)
    .then(result => {
        res.render('orders',{
            createOneOrderSuccess,
            createAllOrdersSuccess,
            cancelOneOrderSuccess,
            cancelAllOrdersSuccess,
            result,
            moment,
            totalAmountInOrders: result.reduce((acc, curr) => acc + (curr.amount * curr.price), 0  ),
            isAuth: req.session.userId ? true : false,
            authUsername: req.session.username,
            isAdmin: req.session.isAdmin ? true : false,
        })
    })
    
}

// post one order from cart
exports.postOneOrderFromCart = (req, res) => {
    if(validationResult(req).isEmpty()){
        const {cartId, address} = req.body;
        const status = 'pending';
        const timeStamp = Date.now()
        const requiredData = {cartId, timeStamp, address, status}
        addOneProductInOrders(requiredData)
        .then(result => {
            console.log(result)
            req.flash('createOneOrderSuccess', `${result}`)
            res.redirect('/orders')
        })
        .catch(error => {
            console.log(error);
        })
    }else{
        req.flash('createOneOrderFaild', validationResult(req).array())
        res.redirect(`/orders/verify_order/${req.body.cartId}`)
    }
    
}

// post all orders from cart
exports.postAllOrdersFromCart = (req, res) => {
    if(validationResult(req).isEmpty()){
        const {userId} = req.session;
        const {address} = req.body;
        const status = 'pending';
        const timeStamp = Date.now()
        const requiredData = {userId, timeStamp, address, status}
        addAllProductsInOrders(requiredData)
        .then(result => {
            console.log(result)
            req.flash('createAllOrdersSuccess', `${result}`)
            res.redirect('/orders')
        })// المشكله في المودل بتاع الاوردر
        .catch(error => {
            console.log(error);
        })
    }else{
        req.flash('createAllOrdersFaild', validationResult(req).array())
        res.redirect(`/orders/verify_all_orders`)
    }
}

// update amount of product in Orders
exports.updateAmountInOrders = (req, res) => {
    console.log('update amount of product in Orders');
}

// cancel one order from order page
exports.cancelOneOrder = (req, res) => {
    const { orderId, orderName } = req.body
    cancelOneOrder(orderId)
    .then(result => {
        console.log(result);
        req.flash('cancelOneOrderSuccess', `${orderName} is canceled successfully from your orders`);
        res.redirect('/orders')
    })
    .catch(error => {
        console.log(error)
    })
}

// cancel all orders from order page
exports.cancelAllOrders = (req, res) => {
    const {userId } = req.session;
    distroyAllOrders(userId)
    .then(result => {
        console.log(result);
        req.flash('cancelAllOrdersSuccess', result);
        res.redirect('/orders')
    })
    .catch(error => {
        console.log(error)
    })
}

//// -> orders/verify_order/:cartId
// get verify on order page
exports.getVerifyOneOrderPage = (req, res) => {
    let createOneOrderFaild = req.flash('createOneOrderFaild');
    res.render('verifyOrder',{
        cartId: req.params.cartId,
        createOneOrderFaild,
        isAuth: req.session.userId ? true : false,
        authUsername: req.session.username,
        isAdmin: req.session.isAdmin ? true : false,
    })
}

//// -> orders/verify_all_orders
// get verify all orders page
exports.getVerifyAllOrdersPage = (req, res) => {
    let createAllOrdersFaild = req.flash('createAllOrdersFaild')
    res.render('verifyAllOrders',{
        createAllOrdersFaild,
        isAuth: req.session.userId ? true : false,
        authUsername: req.session.username,
        isAdmin: req.session.isAdmin ? true : false,
    })
}