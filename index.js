import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import SequelizeStore from "connect-session-sequelize"
import AuthRoute from "./routes/AuthRoute.js"
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"

import database from "./config/DataBase.js"

dotenv.config();

const server = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: database
});

// (async () => {
//     database.sync();
// })();


server.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto"
    }
}))

server.use(cors({
    credentials: true,
    origin: ['http://localhost:5173']
}));

server.use(express.json())

server.use(UserRoute);
server.use(ProductRoute);
server.use(AuthRoute);

server.listen(process.env.SERVER_PORT, () => {
    console.log(`server up and running in port ${process.env.SERVER_PORT}`)
});