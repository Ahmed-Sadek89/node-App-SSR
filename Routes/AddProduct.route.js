const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const multer = require('multer');
const multerMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'Images')
        },
        filename: (req, file, callback) => {
            callback(null, Date.now() + '-' + file.originalname)
        }
    })
}).single('image');

// includes
const {getAddProductPage, postNewProduct} = require('../Controllers/AddProduct.controller');
const {isAdmin} = require('./Guards/isAdmin.guard');

// validation
let check_name = 
    check('name')
    .not().isEmpty().withMessage('name is required')
    .isLength({min: 3, max: 15}).withMessage('name must be from 3 to 15 characters')
    
let check_price = 
    check('price')
    .not().isEmpty().withMessage('price is required')
    .isInt({min: 300, max: 30000}).withMessage('price must be started from 300 to 30000 $');

let check_description = 
    check('description')
    .not().isEmpty().withMessage('description is required')
    .isLength({min: 10}).withMessage('description must be started from 10 characters')

let check_category = 
    check('category')
    .not().isEmpty().withMessage('category is required')
  
let check_image = 
    check('image').custom((value, {req}) => {
        if(req.file){
            return true
        }else{
            throw 'invalid file'
        }
    });



router.get('/', isAdmin,  getAddProductPage)
router.post(
    '/',
    isAdmin,
    multerMiddleware,
    // validation
    check_name, 
    check_price,
    check_description,
    check_category,
    check_image,
    postNewProduct
)

module.exports = router