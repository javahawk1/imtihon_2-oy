const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
    contract_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contracts",
        required: true
    },
    payment_date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    payment_type: {
        type: String,
        enum: ["cash", "card", "bank_transfer"],
        required: true
    }
})

const Payments = mongoose.model("Payments", paymentSchema);

const paymentValidation = Joi.object({
    contract_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

    payment_date: Joi.date()
        .required(),

    amount: Joi.number()
        .min(0)
        .required(),

    payment_type: Joi.string()
        .valid("cash", "card", "bank_transfer")
        .required()
});

module.exports = { Payments, paymentValidation };
