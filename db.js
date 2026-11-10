import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

const DB_NAME = "assignment5";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
});

export const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        await connection.end();

        await sequelize.authenticate();
        await sequelize.sync();
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Fail to connect to DB:", error.message);
    }
};
