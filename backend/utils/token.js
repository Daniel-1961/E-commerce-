import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRES_IN=process.env.JWT_EXPIRES_IN;
export const generateToken = (payload) => {
    // Accept a payload object (e.g. { id, role }) and sign it directly.
    // This matches how controllers call `generateToken`.
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
export const verifyToken=(token)=>{
    try{
        return jwt.verify(token,JWT_SECRET);

    }catch(error){
        return null;
    }
};