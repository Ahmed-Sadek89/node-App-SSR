const validationResult = require('express-validator').validationResult;
const {
    addToCart, getAllItemsFromCart, deleteOneItemInCart, updateOneItemInCart,
    deleteAllProductsInCarts
} = require('../Models/Cart.model');


// get all items in cart
exports.getCart = (req, res) => {
    let addToCartSuccess = req.flash('addToCartSuccess')[0];
    let successDeleting = req.flash('successDeleting')[0];
    let successUpdating = req.flash('successUpdating')[0];
    let errorUpdating = req.flash('errorUpdating');
    let distroyCart = req.flash('distroyCart')[0];

    getAllItemsFromCart(req.session.userId)
    .then((result) => {
        res.render('cart', {
            result,
            addToCartSuccess,
            successDeleting,
            successUpdating,
            errorUpdating,
            totalAmountInCart: result.reduce((acc, curr) => acc + (curr.amount * curr.price), 0  ),
            isAuth: req.session.userId ? true : false,
            authUsername: req.session.username,
            isAdmin: req.session.isAdmin ? true : false,
            distroyCart,
        })
    })
    .catch((error) => {
        console.log(error)
    })
}

// insert one item in cart
exports.postCart = (req, res) => { 
    const {productId, name, price} = req.body;
    const amount = parseInt(req.body.amount)
    const userId = req.session.userId;
    const timeStamp = Date.now()
    const data = {productId, name, price, amount, userId, timeStamp}
    if(validationResult(req).isEmpty()){
        addToCart(data)
        .then(() => {
            req.flash('addToCartSuccess', `${name} * ${amount} added successfully`);
            res.redirect('/cart')
        })
        .catch((error) => {
            console.log(error)
        })
    }else{
        req.flash('errorAmount', validationResult(req).array());
        res.redirect(req.body.redirectTo)
    }
}


// delete one item in cart
exports.deleteCart = (req, res) => {
    const {cartId, cartName} = req.body
    deleteOneItemInCart(cartId)
    .then((result) => {
        console.log(result);
        req.flash('successDeleting', `${cartName} deleted successfully`);
        res.redirect('/cart')
    })
    .catch((error) => {
        console.log(error)
    })
}

// update one item in cart
exports.updateCart = (req, res) => {
    const {cartId, cartName, cartAmount} = req.body;
    if(validationResult(req).isEmpty()){
        updateOneItemInCart(cartId, cartAmount)
        .then((result) => {
            console.log(result);
            req.flash('successUpdating', `${cartName}'s amount is updated successfully in ${cartAmount} items`);
            res.redirect('/cart')
        })
        .catch((error) => {
            console.log(error)
        })
    }else{
        req.flash('errorUpdating', validationResult(req).array());
        res.redirect('/cart')
    }
}

// delete all items in cart
exports.distroyCart = (req, res) => {
    const userId = req.session.userId
    deleteAllProductsInCarts(userId)
    .then(result => {
        req.flash('distroyCart', result);
        res.redirect('/cart')
    })
    .catch((error) => {
        console.log(error)
    })
}