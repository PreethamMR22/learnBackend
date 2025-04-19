import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/User.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken=async(userId)=> {
  try {
      const user=await User.findOne(userId);
      const AccessToken=await user.generateAccessToken();
      const RefreshToken=await user.generateRefreshToken();
      user.refreshToken=RefreshToken;
      await user.save({ValidateBeforeSave: false});
      return {AccessToken,RefreshToken};
  }
  catch(error) {
  throw new ApiError(500,"Something went wrong while generating Access and Refresh Token");
  }
}

//user registeration
const registerUser= asyncHandler ( async (req,res)=> {
    

  // STEPS TO BE FOLLOWED: => ALGORITHM TO REGISTER A USER
  //take user details from frontend
  // validation: not empty correct format?
  //check if user already exists: use unique username and email 
  //check for images, check for avtar- these are compulsory fields 
  //upload on cloudinary, avtar validation, whether it has been uploaded on cloudinary by multer
  //create user object     - create entry in db (.create)
  // remove password and refresh token field from response and then display the same as response
  //check for user creation,(whether it has been created or not)
  // if true: return response, else do it again 


  // user details from front end is taken, and the avtar and the coverImage are necessary fields and they are uploaded to cloudinary through multer middleware and it's in user.routes.js
const {username,email,password,fullname}= req.body;
  // console.log("This is req.body \n",req.body);
  if([username,email,password,fullname].some((field)=> {
    field?.trim() ===""
  })) {
    throw new ApiError(400,"All fields have to be filled");
  }

  const doesUserExist= await User.findOne({
    $or: [{username},{email}]
  })

  if(doesUserExist) {
    throw new ApiError(400,"User with the given UserName or Email does already exist");
  }
 
    const avatarLocalPath=req.files?.avatar[0]?.path;
    let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ) {
     coverImageLocalPath=req.files.coverImage[0].path;
  }

    if(!avatarLocalPath) {
      throw new ApiError(400,"Avatar field is required to be filled");
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new ApiError(500,"Failed uploading Avatar on cloudinary");
    
    
    const user=await User.create ( {
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()
    })
      // console.log("the user looks like this \n",user);
    const isUserCreated= await User.findById(user._id).select( 
      "-password -refreshToken"
    )
    // console.log("The isUserCreated looks like this \n",isUserCreated)
    if(!isUserCreated) {
      throw new ApiError(500,"Something went wrong while creating the user");
    }

    return res.status(201).json(
      new ApiResponse(201,isUserCreated,"User registered successfully")
    )

});

//user login
const userLogin= asyncHandler ( async (req,res)=> {
    //take username and password : req.body
    //you can either use username or email also
    //check if user already exists: if so=>
    // if exists: check the password
    //if correct :  give hime the access token and refresh token=> in cookies
    // or give a response that user is logged in  
    // else, redirect him to create user
    
//method to generate access and refresh token



    const {username,email,password}= req.body;
 if(!username && !email) throw new ApiError(400,"username or email is required, both the fields cannot be empty");
  //check for the existance either through username or mail
const userExists= await User.findOne({
  $or:[{username},{email}]
});
// console.log("userExists\n",userExists);

//checkk if the user exists, if not throw error 404 not found
if(!userExists) {
  throw new ApiError(404,"User with the given username or email doesn't exist\n Create an account")
}

//check for the password, userExitsts is an instance of User class, which has the method isPasswordCorrect
const passwordCheck= await userExists.isPasswordCorrect(password);
// console.log("password check:",passwordCheck);

//if passwordCheck : false, give this error
if(!passwordCheck) throw new ApiError(400,"Invalid user Credentials, Please try again");
// else console.log("Password is matching");


const {AccessToken,RefreshToken}= await generateAccessAndRefreshToken(userExists._id);

const loggedInUser= await User.findOne(userExists._id).select("-password -refreshToken");
const options= {
  httpOnly:true,
  secure:true,
}

return res.status(200)
.cookie("AccessToken",AccessToken,options)
.cookie("RefreshToken",RefreshToken,options)
.json( 
  new ApiResponse(
    200,
    {
      loggedInUser, AccessToken,RefreshToken
    },
    "User logged in Successfully"
  )
)

})

//user logout
const userLogout= asyncHandler(async (req,res)=> {
    await User.findByIdAndUpdate(req.user._id,
      {
        $set: {
          refreshToken:undefined,
        },
        new:true
      }
    )
const options ={
  httpOnly:true,
  secure:true,
}

res.status(200)
.clearCookie("AccessToken",options)
.clearCookie("RefreshToken",options)
.json(
  new ApiResponse(200,{},"Logged Out Successfully")
)
})

//refresh the access token
const refreshAccessToken=  asyncHandler(async (req, res) => {
  const incomingRefreshToken= req.cookies.RefreshToken || req.body.refreshToken;
  if(!incomingRefreshToken) throw new ApiError(401,"unauthorized request");

try {
  const decodedToken=  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?.id_); // console.log the decoded token, it is storing the id in the form: id_, not _id. I was getting error, now i changed it to id_, now it's working fine

  if(!user) {

    throw new ApiError(401,"Invalid refresh token");
  }
  else console.log("no error in user creation");
  if(user?.refreshToken!== incomingRefreshToken) {
      throw new ApiError(401,"Invalid refresh token");
  }

  const options={
    httpOnly:true,
    secure:true
  }
  const {newAccessToken, newRefreshToken}= await generateAccessAndRefreshToken(user._id);

  return res.status(200)
  .cookie("AccessToken",newAccessToken,options)
  .cookie("RefreshToken",newRefreshToken,options)
  .json(
    new ApiResponse(200,{},"Access token refreshed")
  )
  

}
catch(error) {
  throw new ApiError(400,error?.message || "Invalid refresh token")
}

})

export {
registerUser,
userLogin,
userLogout,
refreshAccessToken
}
