const express = require("express")
const router = express.Router()

const { Categories, categoryValidation } = require("../models/categories.model")

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query

        const data = await Categories.find()
            .limit(Number(limit))                
            .skip((Number(page) - 1) * Number(limit))

        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});


router.post("/", async (req, res) => {
    try {
        const { error } = categoryValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }
        const data = await Categories.create(req.body)
        res.send(data)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { error } = categoryValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }
        const data = await Categories.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!data) {
            return res.status(404).send({ error: "category not found" })
        }
        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const data = await Categories.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ error: "category not found" })
        }
        res.send({ deleted: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});

module.exports = router
