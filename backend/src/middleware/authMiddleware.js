import jwt from "jsonwebtoken";
import {User} from '../models/index.js';
export const protect =async(req,res,next)=>{
    let token;
    if(req.header.authorization&&req.headers.authorization.startsWith("Bearer")){
        try{
            token=req.header.authorization.split("")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findByPk(decoded.id,{attributes:{exclude:["password"]}});
            next();
    }catch(error){
        console.error("Token verfication failed:",error);
        return res.status(401).json({message:"Not authorized, invalid token provided"});

    }
        }if(!token){
            return  res.status(401).json({message:"Not authorized, no token provided"});
        }
        
}