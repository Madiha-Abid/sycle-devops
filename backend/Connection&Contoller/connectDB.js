import mongoose from 'mongoose';


const connectDB = async(URL) =>{
  return await mongoose.connect(URL);
}


export { connectDB }