import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/User.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export {registerUser}
