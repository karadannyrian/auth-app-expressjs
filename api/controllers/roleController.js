'use strict';

var mongoose = require('mongoose'),
    Role = mongoose.model('Role');

exports.validateRoleAdmin = (req, res, next) => {
    if (req.user.roles && req.user.roles.length > 0) {
        if (req.user.roles.find(e => e === 'admin')) return next()
    }
    return res.status(401).json({ message: 'Unauthorized role' });
}

exports.getAll = async (req, res) => {
    try {
        const response = await Role.find({})
        if (response) {
            return res.status(200).json({ data: response });
        }
        return res.status(404).json({ message: 'Role not found', data: null });
    } catch (error) {
        return res.status(404).json({ message: error?.message, data: null });
    }
}

exports.createRoleBulk = async (req, res) => {
    try {
        const datas = req.body.map(v => {
            const role = new Role({ roleName: v });
            return role
        })
        const response = await Role.insertMany(datas)
        if (response) return res.status(201).send({ message: 'SUCCESS' })
    } catch (error) {
        return res.status(400).json({ message: error?.message, data: null });
    }
}