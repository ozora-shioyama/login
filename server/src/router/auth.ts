import { Router,Request,Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../db";
import bcrypt from "bcrypt"; //
import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();


export const authrouter=Router();

authrouter.get("/",(req:Request,res:Response)=>{
    res.send("hello auth!!!");
})

authrouter.post("/signup",body("email").isEmail(),body("password").isLength({min:5}),(req:Request,res:Response)=>{
    const email:string=req.body.email;
    const password:string=req.body.password;
    const error=validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({
            message:error.array(),
        })
    }

    pool.query("SELECT s FROM users s WHERE s.email =$1",[email],async(err,result)=>{
        if(err){
            return res.status(400).json({
                message: "SQLにエラーがあります",
            })
        }
        else if(result.rows.length){
            return res.status(400).json({
                message:"既に存在します",
            })
        }else{
            let hashpassword:string=await bcrypt.hash(password,10);
            pool.query("INSERT INTO users(email,password) values ($1, $2)",[email,hashpassword],async(err,result)=>{
                if(err){
                    return res.status(400).json({
                        message:"挿入エラー"
                    })
                }
                else{
                    const token = await jwt.sign({
                     email 
                    },
                    process.env.KEY as string,
                    {
                        expiresIn: "24h",

                    }
                    );
                    return res.json({
                        message:"OK",
                        token: token,
                    })
                }
            })
        }     
    })
    
})
authrouter.get("/allusers",(req:Request,res:Response)=>{
    pool.query("select * from users",(err,result)=>{
        if(err){
            return res.status(400).json({
                message: "読み込みSQLにエラーがあります",
            })                     
        }
        else if(!result.rows.length){
            return res.status(404).json({
                message: "ユーザが見つかりません"
            })
        }
        else{
            return res.status(200).json({
                message: result.rows
            })
        }
    })

})