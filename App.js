// node modules
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const sessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();

// routes modules
const HomeRoute = require('./Routes/Home.route');
const productRoute = require('./Routes/Product.route');
const Auth = require('./Routes/Auth.route');
const cartRoute = require('./Routes/Cart.route');
const ordersRoute = require('./Routes/Orders.route');
const addProductRoute = require('./Routes/AddProduct.route');
// make session collection on my database and make its options
const STORE = new sessionStore({
    uri: process.env.DB_URL,
    collection: 'sessions',
});

app.use(session({
    secret: 'this is a simple long text for helping us to prevent motherfuckers from hacking the session id....',
    saveUninitialized: false,
    resave: false,
    store: STORE
}))

// make session flash
app.use(flash())

// for settings
app.use(express.static(path.join(__dirname, 'Assets')))
app.use(express.static(path.join(__dirname, 'Images')))
app.set('view engine', 'ejs');
app.set('views', 'Views');

// routes
app.use('/', HomeRoute);
app.use('/', Auth); // this route contains login, signup and logout
app.use('/product', productRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/add', addProductRoute);

app.use((req, res) => res.render('404',{
    isAuth: req.session.userId ? true : false,
    authUsername: req.session.username,
    isAdmin: req.session.isAdmin ? true : false,

}))
//start server
const port = process.env.PORT || 3000
app.listen(port, console.log('server is worked on port 3000'))