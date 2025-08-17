const mongoose = require("mongoose")
const joi = require("joi")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
})

const Categories = mongoose.model("Categories", categorySchema)

const categoryValidation = joi.object({
    name: joi.string().trim().required()
})


module.exports = { Categories, categoryValidation }