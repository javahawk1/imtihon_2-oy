const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    address: {
        type: String,
        trim: true
    }
});

const Customers = mongoose.model("Customers", customerSchema);

const customerValidation = Joi.object({
    full_name: Joi.string()
        .trim()
        .required(),

    phone: Joi.string()
        .pattern(/^\+?[0-9]{9,15}$/)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    address: Joi.string()
        .trim()
        .allow("")
});

module.exports = { Customers, customerValidation };
