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
// backend/src/middleware/authMiddleware.js (add below protect)
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};
