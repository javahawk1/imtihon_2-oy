const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")

const { Products, productValidation } = require("../models/products.model")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed!"), false)
    }
}

const upload = multer({ storage, fileFilter })

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const data = await Products.find()
            .populate("brand_id", "name")
            .populate("category_id", "name")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const body = { ...req.body }

        if (req.file) {
            body.image = req.file.filename
        }

        const { error } = productValidation.validate(body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        const data = await Products.create(body)
        res.send(data)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.patch("/:id", upload.single("image"), async (req, res) => {
    try {
        const body = { ...req.body }

        if (req.file) {
            body.image = req.file.filename
        }

        const { error } = productValidation.validate(body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        const data = await Products.findByIdAndUpdate(req.params.id, body, { new: true })
        if (!data) {
            return res.status(404).send({ error: "product not found" })
        }

        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const data = await Products.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ error: "product not found" })
        }
        res.send({ deleted: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router
