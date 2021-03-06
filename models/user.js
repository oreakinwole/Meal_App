require("dotenv").config();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

// Joi Validate User Schema
function validateUser(user) {
    const schema = {
        username:Joi.string().min(2).max(100).required(),
        email:Joi.string().min(1).max(200).required().email(),
        password:Joi.string().min(5).max(1024).required(),
        isAdmin:Joi.boolean()
    }; 
    return Joi.validate(user, schema);
  }


// Mongoose Validate User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200
    },

    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 200
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});



userSchema.methods.generateAuthToken = function () {
    
    const token = jwt.sign({ _id: this._id, username: this.username, isAdmin: this.isAdmin }, process.env.SECRET_KEY, { expiresIn: 7200 });

    return token;
};

userSchema.methods.generateAuthTokenForUser = function () {
    
    const token = jwt.sign({ _id: this._id, username: this.username, isAdmin: this.isAdmin }, process.env.SECRET_KEY, { expiresIn: 240 });

    return token;
};

const User = mongoose.model('User', userSchema);

exports.User = User;
exports.validate = validateUser; 