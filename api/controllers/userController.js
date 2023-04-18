'use strict';

const { ObjectId } = require('bson');

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    User = mongoose.model('User'),
    Profile = mongoose.model('Profile');


const setPayload = (req) => {
    let payload
    if (req.body.email) payload = { email: req.body.email }
    else payload = { username: req.body.username }
    return payload
}

exports.register = async (req, res) => {
    const newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    try {
        const response = await newUser.save()
        if (response) {
            const payload = {
                userID: response._id,
                fullname: req.body.fullname,
                birthPlace: null,
                birthDate: null,
                phoneNumber: null,
                imageUrl: null,
            }
            const newProfile = await new Profile(payload);
            await newProfile.save()
            return res.status(201).send({ message: 'SUCCESS' })
        }
    } catch (error) {
        return res.status(400).send({ message: error.message })
    }
}

exports.signin = async (req, res) => {
    try {
        let payload = setPayload(req)
        const response = await User.findOne(payload)
        if (!response) {
            return res.status(401).json({ message: 'Authentication failed. User not found' });
        }
        if (!response.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid password' });
        }

        let dataJwt = {
            email: response.email,
            username: response.username,
            id: response._id,
            roles: response.roles
        }
        const profile = await Profile.findOne({ userID: new ObjectId(response._id) })
        if (profile) {
            dataJwt = { ...dataJwt, ...profile._doc }
        }
        return res.json({
            token: jwt.sign(dataJwt, process.env.JWT_SECRET_KEY, { expiresIn: '2 days' })
        });
    } catch (error) {
        return res.status(401).json({ message: error?.message });
    }
}

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
};

exports.profile = function (req, res, next) {
    if (req.user) {
        res.send(req.user);
        next();
    }
    else {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.getByID = async (req, res) => {
    try {
        const response = await User.findOne({ _id: new ObjectId(req.params.id) })
        if (response) {
            response.hash_password = undefined
            response.__v = undefined
            return res.status(200).json({ data: response });
        }
        return res.status(404).json({ message: 'User not found', data: null });
    } catch (error) {
        return res.status(404).json({ message: error?.message, data: null });
    }
}

exports.updateUser = async (req, res) => {
    var newUser = new User(req.body);
    try {
        let payload = { _id: new ObjectId(req.body.id) }
        const response = await User.updateOne(payload,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    updated: newUser.updated
                },
            })
        if (response) {
            if (response.modifiedCount > 0) return res.status(200).json({ message: 'User updated', data: null });
            return res.status(404).json({ message: 'Data not found', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: error?.message, data: null });
    }
}

exports.changePassword = async (req, res) => {
    try {
        let payload = setPayload(req)
        if (req.body.newPassword === req.body.oldPassword) {
            return res.status(404).json({ message: "New password invalid", data: null });
        }
        let response = await User.findOne(payload)
        if (!response) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (!response.comparePassword(req.body.oldPassword)) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const hash_password = bcrypt.hashSync(req.body.newPassword, 10);
        response = await User.updateOne(payload,
            {
                $set: {
                    hash_password: hash_password
                },
            })
        if (response) {
            if (response.modifiedCount > 0) return res.status(200).json({ message: 'Password updated', data: null });
            return res.status(404).json({ message: 'Data not found', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: error?.message, data: null });
    }
}