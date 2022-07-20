const { mongoose } = require('mongoose');
require('dotenv').config()

const url = process.env.DB_URL;
const cartSchema = mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    timeStamp: Number,
})

const Cart = mongoose.model('cart', cartSchema);

// add a product in cart
const addToCart = data => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => { // check if this product has this product with same user
            return Cart.findOne({productId: data.productId, userId: data.userId })
        }).then((result) => {
            if(result){ // this product is already in cart
                return Cart.updateOne(
                    {_id: result._id},
                    {$set: {
                        amount: parseInt(data.amount + result.amount)
                    }}
                )
                
            }else{ // this product is not in cart
                let newData = new Cart(data);
                return newData.save()
            }
        })
        .then(() => {
            mongoose.disconnect()
            resolve('product added successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}


// get all product in cart accoring to userId
const getAllItemsFromCart = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Cart.find({userId}).sort({timeStamp: -1})
        }).then((result) => {
            mongoose.disconnect();
            resolve(result)
        }).catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

// delete a product in cart
const deleteOneItemInCart = (cartId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Cart.deleteOne({_id: cartId})
        })
        .then(() => {
            mongoose.disconnect();
            resolve('item deleted successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

// update a product in cart
const updateOneItemInCart = (cartId, newAmount) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Cart.updateOne(
                {_id: cartId},
                {$set: {
                    amount: newAmount
                }}    
            )
        })
        .then(() => {
            mongoose.disconnect();
            resolve('item updated successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

// delete all products in cart
const deleteAllProductsInCarts = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return Cart.deleteMany({userId})
        })
        .then(() => {
            mongoose.disconnect();
            resolve('cart distroyed successfully')
        })
        .catch((error) => {
            mongoose.disconnect()
            reject(error)
        })
    })
}

module.exports = {
    Cart,// export to Order.model to get its data according to CartId or getting its data 
    addToCart,
    getAllItemsFromCart,
    deleteOneItemInCart,
    updateOneItemInCart,
    deleteAllProductsInCarts
};