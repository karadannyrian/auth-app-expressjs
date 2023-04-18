'use strict';
module.exports = function (app) {
    const userHandlers = require('../controllers/userController.js');
    const roleHandlers = require('../controllers/roleController.js');
    // todoList Routes
    app.route('/auth/role/getAll')
        .get(userHandlers.loginRequired, roleHandlers.validateRoleAdmin, roleHandlers.getAll)
    app.route('/auth/role/create')
        .post(userHandlers.loginRequired, roleHandlers.validateRoleAdmin, roleHandlers.createRoleBulk)
};