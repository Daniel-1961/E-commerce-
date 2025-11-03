import bcrypt from 'bcrypt';
import {User, Address} from "../models/index.js";
import { generateToken } from '../../utils/toke.js';
//register
export const registerUser=async(req,res)=>{
    try{
        const{name,email,password,phone,address}=req.body;
        //check if the user exist
        const existingUser=await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message:"Email already registered"});
        }
        
            const hashedPassword=await bcrypt.hash(password,10);
            //creating new user
            const newUser=await User.create({
                name,
                email,
                password:hashedPassword,
                phone
            });
            // add optional address
            if(address){
                await Address.create({
                    userId:newUser.id,
                    ...address
                });
                const token=generateToken(newUser.id);
              res.status(201).json({message:"Registration successful",token});
             }
        }catch(error){
                console.error("Registration error:",error);
                res.status(500).json({message:"Server Error"})
            
        }
    }
    //LOGIN
    export const loginUser=async(req,res)=>{
        try{
            const {email,password}=req.body;
            //Find User
            const user=await User.findOne({where:{email}});
            if(!user) return res.status(404).json({message:"User not found"})
            const isMatch=await bcrypt.compare(password,user.password)  
            if(!isMatch) return res.status(401).json({message:"invalid credentials"});
            const token=generateToken(user.id);
            res.json({message:"Login successful",token});

        }catch(error){
            console.log("Login Error",error);
            res.status(500).json({message:"Server error"});
        }
    };
