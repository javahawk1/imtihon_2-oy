const mongoose = require("mongoose")
const joi = require("joi")

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
})

const Brands = mongoose.model("Brands", brandSchema)

const brandValidation = joi.object({
    name: joi.string().trim().required()
})

module.exports = { Brands, brandValidation }