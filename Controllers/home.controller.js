const productsModel = require('../Models/product.model');

exports.getHome = (req, res) => {
    const categoryItems = ['computers', 'clothes', 'electronics', 'sadek'];
    let categoryQuery = req.query.category;
    const productRendering = (products) => {
        let successAuth = req.flash('successAuth')[0]
        let errorAmount = req.flash('errorAmount');
        const successCreatingOneProduct = req.flash('successCreatingOneProduct')[0];
        res.render('index', {
            products: products,
            isAuth: req.session.userId ? true : false,
            isAdmin: req.session.isAdmin ? true : false,
            successAuth,
            errorAmount,
            authUsername: req.session.username,
            successCreatingOneProduct
        })
    }
    // check if there are category and if categoryQuery !== all, render according to category
    if(categoryQuery && categoryItems.includes(categoryQuery)){
        productsModel.getProductsAccordingToCategory(categoryQuery)
        .then(productRendering)
    }else{ // else, render all products
        productsModel.getAllProducts()
        .then(productRendering)
    }
}