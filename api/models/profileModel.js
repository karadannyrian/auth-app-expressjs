'use strict';
const { ObjectId } = require('bson');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
    userID: {
        type: ObjectId,
        unique: true,
        lowercase: true,
        required: true
    },
    fullname: {
        type: String,
    },
    birthPlace: String,
    birthDate: String,
    phoneNumber: String,
    imageUrl: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: null
    }
});

mongoose.model('Profile', ProfileSchema);