import express,{Request,Response} from "express";
import { authrouter } from "./router/auth";

const app = express();
const PORT=5050;

app.use(express.json())
app.use("/auth",authrouter);

app.get("/test",(req:Request,res:Response)=>{
    res.send("hello exporess!");
})

app.listen(PORT,()=>{
    console.log(`Server is running. Port number is ${PORT}.`);
})