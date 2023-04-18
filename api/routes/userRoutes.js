'use strict';
module.exports = function (app) {
    const userHandlers = require('../controllers/userController.js');
    // todoList Routes
    app.route('/user/getByID/:id')
        .get(userHandlers.loginRequired, userHandlers.getByID)
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/signin')
        .post(userHandlers.signin);
    app.route('/auth/updateUser')
        .put(userHandlers.loginRequired, userHandlers.updateUser);
    app.route('/auth/changePassword')
        .post(userHandlers.loginRequired, userHandlers.changePassword);
};