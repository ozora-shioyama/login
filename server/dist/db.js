"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    database: "ozora",
    password: process.env.pass,
    port: 5432
});
