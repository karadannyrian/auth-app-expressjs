'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Role Schema
 */
var RoleSchema = new Schema({
    roleName: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: null
    }
});

mongoose.model('Role', RoleSchema);