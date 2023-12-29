import { Sequelize } from "sequelize";

const database = new Sequelize('latihan_1', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

export default database