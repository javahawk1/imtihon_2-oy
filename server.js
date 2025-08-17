const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

app.use(express.json())

const cors = require("cors")
app.use(cors())

const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err))

const brands = require("./routes/brands.route")
const categories = require("./routes/categories.route")
const contracts = require("./routes/contracts.route")
const customers = require("./routes/customers.route")
const payments = require("./routes/payments.route")
const products = require("./routes/products.route")

app.use("/brands", brands)
app.use("/categories", categories)
app.use("/contracts", contracts)
app.use("/customers", customers)
app.use("/payments", payments)
app.use("/products", products)

app.listen(3000, () => console.log("server started"))