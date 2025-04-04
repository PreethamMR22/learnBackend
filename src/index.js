import dotenv from "dotenv"
import express from 'express'
import mongoose from 'mongoose'
import { DB_NAME } from './constants.js'
import connectDB from "./db/indexdb.js"
dotenv.config({path:'./env'})

connectDB();







// const app=express()
// ;(async ()=> {
//    try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         app.on("errror",(error)=> {
//             console.log("the error occured is: ",error);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=> {
//             console.log("Application listening on port: ",process.env.PORT);
//         })
//    }
//    catch(error) {
//        console.log(error);
//        throw error;
//    }
// })()