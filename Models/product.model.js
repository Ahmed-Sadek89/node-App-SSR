const mongoose = require('mongoose');
require('dotenv').config()

const url = process.env.DB_URL;

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,
});
const Product = mongoose.model('product', productSchema);

const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
           }).then(() => {
            return Product.find({})
        }).then(products => {
            mongoose.disconnect();
            resolve(products)
        }).catch(error => {
            reject(error)
        })
    })
}

const getProductsAccordingToCategory = (category) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Product.find({category: category})
        }).then(category => {
            mongoose.disconnect()
            resolve(category);
        }).catch(error => {
            reject(error)
        })
    })
}

const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Product.findOne({_id: id})
        }).then(product => {
            mongoose.disconnect()
            resolve(product);
        }).catch(error => {
            reject(error)
        })
    })
}

const createOneProduct = ({name, price, category, description, image}) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            let product = new Product({
                name, price, category, description,
                image
            })
            return product.save()
        }).then(() => {
            mongoose.disconnect()
            resolve(`product ${name} is created successfully`);
        }).catch(error => {
            reject(error)
        })
    }) 
}

module.exports = {
    getAllProducts,
    getProductsAccordingToCategory,
    getProductById,
    createOneProduct
}