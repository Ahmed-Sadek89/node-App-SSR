const {Router} = require('express');
const router = Router();
const HomeController = require('../Controllers/home.controller');

router.get('/', HomeController.getHome);

module.exports = router