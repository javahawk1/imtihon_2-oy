const express = require("express")
const router = express.Router()

const { Brands, brandValidation } = require("../models/brands.model")

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query

        const data = await Brands.find()
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))

        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


router.post("/", async (req, res) => {
    try {
        const { error } = brandValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }
        const data = await Brands.create(req.body)
        res.send(data)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const { error } = brandValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }
        const data = await Brands.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!data) {
            return res.status(404).send({ error: "brand not found" })
        }
        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const data = await Brands.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ error: "brand not found" })
        }

        res.send({ deleted: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router