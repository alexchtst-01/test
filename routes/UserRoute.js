import express from "express"
import { getUser, getUserById, createUser, updateUser, deleteUser } from "../controller/User.js"
import { verify, admOnly } from "../middleware/AuthUser.js"

const route = express.Router()

route.get('/latihan1api/user', verify, admOnly, getUser)
route.get('/latihan1api/user/:id', verify, admOnly, getUserById)
route.post('/latihan1api/user', createUser)
route.patch('/latihan1api/user/:id', verify, admOnly, updateUser)
route.delete('/latihan1api/user/:id', verify, admOnly, deleteUser)

export default route