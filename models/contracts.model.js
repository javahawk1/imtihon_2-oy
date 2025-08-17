const mongoose = require("mongoose")
const Joi = require("joi")

const contractSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customers",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    durationMonth: {
        type: Number,
        required: true,
        min: 1
    },
    initialPayment: {
        type: Number,
        required: true,
        min: 0
    },
    interestRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
})

const Contracts = mongoose.model("Contracts", contractSchema)

const contractValidation = Joi.object({
    customer_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

    product_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

    startDate: Joi.date()
        .required(),

    durationMonth: Joi.number()
        .integer()
        .min(1)
        .required(),

    initialPayment: Joi.number()
        .min(0)
        .required(),

    interestRate: Joi.number()
        .min(0)
        .max(100)
        .optional(),

    totalAmount: Joi.number()
        .min(0)
        .optional()
});

module.exports = { Contracts, contractValidation }
