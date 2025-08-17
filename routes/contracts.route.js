const express = require("express")
const router = express.Router()
const Joi = require("joi")

const { Contracts, contractValidation } = require("../models/contracts.model")
const { Products } = require("../models/products.model");

router.get("/sold-products", async (req, res) => {
    try {
        const start = new Date(req.query.start)
        const end = new Date(req.query.end)

        const contracts = await Contracts.find({
            startDate: { $gte: start, $lte: end }
        })
            .populate("customer_id")
            .populate("product_id")

        res.send(contracts)
    } catch (err) {
        res.send({ error: err.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const data = await Contracts.find()
            .populate("customer_id", "full_name phone email")
            .populate("product_id", "name price")
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
        res.send({ data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

function calculateInterestRate(durationMonth) {
    switch (durationMonth) {
        case 5: {
            return 0.26
        }
        case 10: {
            return 0.41
        }
        case 15: {
            return 0.52
        }
        default: throw new Error("Invalid duration. Only 5, 10, or 15 months allowed")
    }
}

router.post("/", async (req, res) => {
    try {
        const { error } = contractValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        const product = await Products.findById(req.body.product_id)
        if (!product) {
            return res.status(404).send({ error: "mahsulot topilmadi" })
        }

        const requiredInitial = product.price * 0.25
        if (req.body.initialPayment < requiredInitial) {
            return res.status(400).send({ 
                error: `Boshlangich tolov kamida ${requiredInitial} som bolishi kerak` 
            });
        }

        const interestRate = calculateInterestRate(req.body.durationMonth)
        const totalAmount = (product.price - req.body.initialPayment) * (1 + interestRate)

        const contract = await Contracts.create({
            ...req.body,
            totalAmount: Math.round(totalAmount),
            interestRate: interestRate * 100 
        });

        res.send(contract);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

const contractUpdateValidation = Joi.object({
    customer_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    product_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    startDate: Joi.date(),
    durationMonth: Joi.number().integer().min(1),
    initialPayment: Joi.number().min(0),
    interestRate: Joi.number().min(0).max(100),
    totalAmount: Joi.number().min(0)
})

router.patch("/:id", async (req, res) => {
    try {
        const { error } = contractUpdateValidation.validate(req.body)
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        }

        const oldContract = await Contracts.findById(req.params.id)
        const product = await Products.findById(req.body.product_id || oldContract.product_id)
        if (!product) {
            return res.status(404).send({ error: "Mahsulot topilmadi" })
        }

        const newInitial = req.body.initialPayment || oldContract.initialPayment
        const requiredInitial = product.price * 0.25
        if (newInitial < requiredInitial) {
            return res.status(400).send({
                error: `Boshlang'ich to'lov kamida ${requiredInitial} so'm bo'lishi kerak`
            });
        }

        const duration = req.body.durationMonth || oldContract.durationMonth
        const interestRate = calculateInterestRate(duration)
        const totalAmount = (product.price - newInitial) * (1 + interestRate)

        const updatedContract = await Contracts.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                totalAmount: Math.round(totalAmount),
                interestRate: interestRate * 100
            },
            { new: true }
        )

        res.send(updatedContract)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const data = await Contracts.findByIdAndDelete(req.params.id)
        if (!data) {
            return res.status(404).send({ error: "contract not found" })
        }
        res.send({ deleted: data })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

module.exports = router
