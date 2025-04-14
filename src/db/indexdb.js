import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'

const connectDB=async()=> {
try {
    const connectionInstances=await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`);
    console.log(`\n Mongo db connected!! DB HOST ${connectionInstances.connection.host}`)
}
catch(error) {
    console.log("The error occured in mongo dp connection ",error);
    process.exit(1);
}
}

export default connectDB;