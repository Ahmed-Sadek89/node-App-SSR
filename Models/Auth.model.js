const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config()

const url = process.env.DB_URL;

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('user', userSchema);

exports.createNewUser = (username, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            // check if there is this email existed in collection or not
            return User.findOne({email})
        }).then(result => { // if exist => reject
            if(result){
                mongoose.disconnect();
                reject('this email is already existed')
            }else{ // else if not exist => make hash to your password and create new user
                return bcrypt.hash(password, 10)
            }
        }).then(password => {
            const newUser = new User({
                username, 
                email,
                password
            })
            return newUser.save()
        }).then((resultOfCreating) => {
            mongoose.disconnect()
            resolve(resultOfCreating);
        }).catch(error => {
            mongoose.disconnect()
            reject(error);
        })
    })
}

exports.checkLogin = (email, password) => {
    let userAuthenticated;
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then(() => {
            return User.findOne({email})
        }).then(user => {
            if(!user){
                mongoose.disconnect();
                reject('invalid email')
            }else{
                userAuthenticated = user
                return bcrypt.compare(password, user.password)
            }
        }).then(samePassword => {
            if(!samePassword){
                mongoose.disconnect();
                reject('invalid password')
            }else{
                mongoose.disconnect()
                let auth = {
                    userId: userAuthenticated._id, 
                    username: userAuthenticated.username, 
                    email: userAuthenticated.email,
                    isAdmin: userAuthenticated.isAdmin
                }
                resolve(auth)
            }
        }).catch(error => {
            mongoose.disconnect()
            reject(error);
        })
    })
}
