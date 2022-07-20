const {Router} = require('express');
const router = Router();
const {ProductNotFound, ProductController} = require('../Controllers/Product.controller');

router.get('/', ProductNotFound)

router.get('/:id', ProductController)


module.exports = router