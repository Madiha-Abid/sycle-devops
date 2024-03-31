import express from 'express';
import {adminRouter, commonRouter, customerRouter} from './Connection&Contoller/routes.js';
import {connectDB} from './Connection&Contoller/connectDB.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from "cors";

//import dotenv from 'dotenv';
//dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: '*'
}))

const PORT = 3005;
// const URL = "mongodb+srv://SystainCycle:SC12345678@cluster0.dytrxzh.mongodb.net/sycle";
const URL = "mongodb+srv://SystainCycle:SC12345678@cluster0.dytrxzh.mongodb.net/sycle";
// const URL = "mongodb+srv://SystainCycle:SC12345678@cluster0.dytrxzh.mongodb.net/test";


const start = async()=>{
    try {
        await connectDB(URL);
        app.listen(PORT, ()=>{
            console.log("SERVER IS LISTENING ON PORT ");
        })
    } catch (error) {
        console.log(error);
    }
}   
  


app.use(customerRouter);
app.use(adminRouter);
app.use(commonRouter);

start()
const db = mongoose.connection;
    
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connection successful');
});