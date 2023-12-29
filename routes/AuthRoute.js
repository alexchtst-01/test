import express from "express"
import { LogIn, Me, LogOut } from "../controller/Auth.js"

const route = express.Router()

route.post('/login', LogIn)
route.get('/me', Me)
route.delete('/logout', LogOut)

export default route