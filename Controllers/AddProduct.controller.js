const { createOneProduct } = require('../Models/product.model');
const { validationResult } = require('express-validator')


const getAddProductPage = (req, res) => {
    const errorCreatingOneProduct = req.flash('errorCreatingOneProduct');
    res.render('addProducts', {
        isAuth: req.session.userId ? true : false,
        authUsername: req.session.username,
        isAdmin: req.session.isAdmin ? true : false,
        errorCreatingOneProduct
    })
}

const postNewProduct = (req, res) => {
    const {name, price, category, description} = req.body;
    const image = req.file?.filename
    const data = {name, price, category, description, image}
    if(validationResult(req).isEmpty()){
        createOneProduct(data)
        .then(result => {
            req.flash('successCreatingOneProduct', result);
            res.redirect('/');
        })
        .catch(error => {
            console.log(error);
        })
    }else{
        console.log(validationResult(req).array());
        req.flash('errorCreatingOneProduct', validationResult(req).array());
        res.redirect('/add');
    }
    
}

module.exports = {
    getAddProductPage, 
    postNewProduct
}