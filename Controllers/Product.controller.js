const { getProductById } = require('../Models/product.model')

exports.ProductNotFound = (req, res, next) => {
    res.render('404',{
        isAuth: req.session.userId ? true : false,
        authUsername: req.session.username

    })
}

exports.ProductController = (req, res, next) => {
    let id = req.params.id;
    getProductById(id).then(product => {
        let errorAmount = req.flash('errorAmount');
        res.render('product', {
            product: product,
            isAuth: req.session.userId ? true : false,
            errorAmount,
            authUsername: req.session.username,
            isAdmin: req.session.isAdmin ? true : false,
        })
    })
} 