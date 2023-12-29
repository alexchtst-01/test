import express from "express"
import {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controller/Product.js"
import { verify } from "../middleware/AuthUser.js"

const route = express.Router()

route.get('/latihan1api/product', verify, getProduct)
route.get('/latihan1api/product/:id', verify, getProductById)
route.post('/latihan1api/product', verify, createProduct)
route.patch('/latihan1api/product/:id', verify, updateProduct)
route.delete('/latihan1api/product/:id', verify, deleteProduct)


export default route