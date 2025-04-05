import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const videoSchema= new mongoose.Schema(
    {
        videoFile: {
            type:String, //cloudinary url
            required:true,
        },
        thumbnail: {
            type:String, //cloudinary
            required:true,
        },
        owner: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        title: {
            type:String,
            required:true,
            minlength:[3,"Title length should be atleast 3char long"],
            maxlength:[20,"Title length shouldn't exceed 20 char"],
        },
        description: {
            type:String,
            minlength:[3,"Description length should be atleast 3char long"],
            },
        duration :{
            type:Number,  //cloudinary url=> it sends the time as well
            required:true,
        },
        views :{
            type:Number,
            default:0,
            required:true,
        },
        isPublished :{
            type:Boolean,
            required:true,
        },
    },
    {timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate);

export const Video= mongoose.model("Video",videoSchema);