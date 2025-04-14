import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

//settings before hand
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


  
//import routes 
import UserRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users",UserRouter);   //app.get is used when we werent using router as a seperate file, there were both route and controller at the same time, so here we use a middleware, its compulsory
//now the call goes to http://localhost:8000/users => now inside users, we will get another rouute, open the users.router.js and see
//but its an industrially set standard to use /api/version1/users in the url to make it unique

export { app };