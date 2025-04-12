import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const userSchema= new mongoose.Schema(
    {

        watchHistory: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }],
        username: {
            type:String,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
            minlength:[5,"UserName should be of length 5 letters atleast"],
            maxlength:[20,"UserName should not exceed 20 characters"],
        },
        email: {
            type:String,
            unique:true,
            lowercase:true,
            trim:true,
        },
       fullname: {
            type:String,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, //cloudinary service has to be used, where images and videos are stored and a url is extract in return 
        },
        password: {
            type:String,
            required:[true,"Password is required"],
        },
        avatar:{
            type:String,
            requried:true,
        },
        coverImage: {
            type:String, //cloudinary url
        },
        refreshToken: {
            type:String,
            
        }
    },
    {
        timestamps:true
    })


//pasword check
userSchema.methods.isPasswordCorrect= async function(password) {
return await bcrypt.compare(password,this.password);
}



    //password encryption
userSchema.pre("save",async function  () {
    if(!this.isModified("password")) return next();
    this.password= bcrypt.hash(this.password,10);
    next();
})

//custom methods to generate the tokens
userSchema.methods.generateAccessToken= function () {
   return  jwt.sign ({
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email,        
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}
userSchema.methods.generateRefreshToken=function() {
    return jwt.sign({
        id_:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:REFRESH_TOKEN_EXPIRY,
    }
)
}

export const User = mongoose.model("User",userSchema);