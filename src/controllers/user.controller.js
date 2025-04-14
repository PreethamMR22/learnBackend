import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser= asyncHandler ( async (req,res)=> {
    
  //take user details from frontend
  // validation: not empty correct format?
  //check if user already exists: use unique username and email 
  //check for images, check for avtar- these are compulsory fields 
  //upload on cloudinary, avtar validation, whether it has been uploaded on cloudinary by multer
  //create user object     - create entry in db (.create)
  // remove password and refresh token field from response and then display the same as response
  //check for user creation,(whether it has been created or not)
  // if true: return response, else do it again 

  const {username,email}= req.body;
  console.log("The userName: ",username);
  console.log("email: ",email);

});

export {registerUser}
