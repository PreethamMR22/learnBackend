    import { Router } from "express";
    import { registerUser } from "../controllers/user.controller.js"; //end alli use .js, otherwise it gives error

    const router= Router();

    router.route("/register").post(registerUser) //here the call has already come to /users and now we 
    //are making the call to /register , so the api hits the url => http://localhost:8000/users/register
    //now if i wanna make a login methid here /users/login band bidatte, if i writehere only 

    export default router;