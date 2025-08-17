const mongoose = require("mongoose")
const Joi = require("joi")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
})

const Products = mongoose.model("Products", productSchema)

const productValidation = Joi.object({
    name: Joi.string()
        .trim()
        .required(),

    brand_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

    category_id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

    price: Joi.number()
        .min(0)
        .required(),

    description: Joi.string()
        .trim(),

    image: Joi.string()
        .trim()
});

module.exports = { Products, productValidation }