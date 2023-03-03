"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authrouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
exports.authrouter = (0, express_1.Router)();
exports.authrouter.get("/", (req, res) => {
    res.send("hello auth!!!");
});
exports.authrouter.post("/signup", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").isLength({ min: 5 }), (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            message: error.array(),
        });
    }
    db_1.pool.query("SELECT s FROM users s WHERE s.email =$1", [email], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({
                message: "SQLにエラーがあります",
            });
        }
        else if (result.rows.length) {
            return res.status(400).json({
                message: "既に存在します",
            });
        }
        else {
            let hashpassword = yield bcrypt_1.default.hash(password, 10);
            db_1.pool.query("INSERT INTO users(email,password) values ($1, $2)", [email, hashpassword], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(400).json({
                        message: "挿入エラー"
                    });
                }
                else {
                    const token = yield jsonwebtoken_1.default.sign({
                        email
                    }, process.env.KEY, {
                        expiresIn: "24h",
                    });
                    return res.json({
                        message: "OK",
                        token: token,
                    });
                }
            }));
        }
    }));
});
exports.authrouter.get("/allusers", (req, res) => {
    db_1.pool.query("select * from users", (err, result) => {
        if (err) {
            return res.status(400).json({
                message: "読み込みSQLにエラーがあります",
            });
        }
        else if (!result.rows.length) {
            return res.status(404).json({
                message: "ユーザが見つかりません"
            });
        }
        else {
            return res.status(200).json({
                message: result.rows
            });
        }
    });
});
