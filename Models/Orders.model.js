const {Cart} = require('./Cart.model');
const {mongoose} = require('mongoose');
require('dotenv').config()

const url = process.env.DB_URL;
const orderSchema = mongoose.Schema({
    // cart info
    productId: String,
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    // order info
    timeStamp: Number,
    address: String,
    status: String,
})

const Order = mongoose.model('order', orderSchema);


// display all product in Order
const displayAllProductInOrder = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Order.find({userId}).sort({timeStamp: -1})
        })
        .then(result => {
            mongoose.disconnect();
            resolve(result)
        })
        .catch(error => {
            mongoose.disconnect();
            reject(error)
        })
    })
}

// add one product from cart in orders
const addOneProductInOrders = ({cartId, timeStamp, address, status}) => {
    return new Promise((resolve, reject) => {
        // first: find the product in cart
        // second: add it in orders
        // third: remove it from cart 
        mongoose.connect(url).then(() => { 
            return Cart.findOne({cartId}, {_id: 0, timeStamp: 0})
        })
        .then(cartResult => {
            if(!cartResult){
                mongoose.disconnect()
                reject('error in getting order from cart, its might been removed from cart')
            }else{
                let {productId, name, price, amount, userId} = cartResult
                let newOrder = new Order({
                    productId, name, price, amount, userId,
                    timeStamp, address, status
                })
                return newOrder.save()
            }
        })
        .then(() => {
            return Cart.deleteOne({cartId}) 
        })
        .then(() => {
            mongoose.disconnect()
            resolve('product added successfully to your Orders, and removed from your cart')
        })
        .catch(error => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

// add all products from cart in orders
const addAllProductsInOrders = ({userId, timeStamp, address, status}) => {
    // first: find the all products in cart that have same userId
    // second: add it in orders
    // third: update it to add your new properties {userId, timeStamp, address, status} 
    // forth: remove it from cart 
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Cart.find({userId}, {_id: 0, timeStamp: 0})
        })
        .then(cartResult => {
            if(!cartResult){
                mongoose.disconnect()
                reject('error in getting order from cart, its might been removed from cart')
            }else{
                return Order.insertMany(cartResult)
            }
        })
        .then((result) => {
            return Order.updateMany(
                { $or: result},
                {
                    $set: {
                        timeStamp,
                        address, 
                        status
                    }
                }
            )
        })
        .then(() => {
            return Cart.deleteMany({userId}) 
        })
        .then(() => {
            mongoose.disconnect();
            resolve('all products added successfully to your Orders, and all removed from your cart')
        })
        .catch(error => {
            mongoose.disconnect();
            reject(error)
        })
    })
}

// cancel one order 
const cancelOneOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Order.deleteOne({_id: orderId})
        })
        .then(() => {
            mongoose.disconnect();
            resolve('order cenceled successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

// cancel all orders
const distroyAllOrders = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Order.deleteMany({userId})
        })
        .then(() => {
            mongoose.disconnect();
            resolve('all orders are canceled successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

module.exports = {
    displayAllProductInOrder,
    addOneProductInOrders,
    addAllProductsInOrders,
    cancelOneOrder,
    distroyAllOrders
}