const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contactController = require('./src/controllers/contactController');

const {loginRequired} = require('./src/middlewares/middleware');

//Home
route.get('/', homeController.index);

//Login
route.get('/login/', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//Contato
route.get('/contact', loginRequired, contactController.index);
route.post('/contact/register', contactController.register);
route.get('/contact/:id', loginRequired, contactController.editIndex);


module.exports = route;
