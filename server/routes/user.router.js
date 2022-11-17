const express = require('express');
const usersController = require('./../controllers/users.controller');
const router = express.Router();

router.get('/user', usersController.get);
router.get('/user/:email', usersController.getUserByEmail);
router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.post('/logout', usersController.logout);
router.delete('/user', usersController.deleteUser);

module.exports = router;
