import { userModel, userPermissionsChecker } from "../../database/user.js";
import mongoose from "mongoose";
import { reviewModel } from "../../database/review.js";
import { distance } from "../../Connection&Contoller/authMiddleware.js";



export const getUsersByLocation = async (req, res) => {
    const userId = req.params.id;
    const radius = req.query.radius;
    try {    
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send(`User with id ${userId} not found`);
      }
      //1st parameter is always longitude and 2nd one is latitude
      //latitude should be within the range of -90 to 90 
      //longitude should be within the range of -180 to 180.
      //latitude 24--30 want [longtiude,latitude]
      //longitude 67--70 stored[latitude,longitude]
      // @ts-ignore
            // Extract the user's location coordinates
      // @ts-ignore
      const [longitude, latitude] = user.location.coordinates;
      console.log(`User location: ${latitude}, ${longitude}`);
  
      // Find all products
      const products = await userModel.find({});
      
      // Filter products by location
      const output = [];
      products.forEach(product => {
        // @ts-ignore
        const [refLongitude, refLatitude] = product.location.coordinates;
        console.log(`Products location: ${refLatitude}, ${refLongitude}`);
        const d = distance(latitude, longitude, refLatitude, refLongitude);
        if (d < radius) {
          output.push(product);
        }
      });
      if(output.length==0){
        return res.json("No products near by");
      }else{
        return res.send(output);
      }
    } catch (err) {
      console.error(err);  
      return res.status(500).send('Internal server error');
    }
  };
           
 


export const getUserById = async (req, res) => {
    const permission = userPermissionsChecker.get(req.params, req.user);
    const userId = req.params.id;
    try {
        if(permission.allowed){
        const singleUser = await userModel.findById(userId);
        if (!singleUser) {
            res.status(404).send(`user with id ${userId} not found`)
            return
        }
        console.log(JSON.stringify(singleUser));
        res.status(200).send(singleUser);
    }
    else{
        res.status(400).json({error: permission.error});
    }
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
}

export const getAllUsers = async (req, res) => {
    const permission = userPermissionsChecker.get(req.body, req.user);
    try {
        if(permission.allowed){
        const allUsers = await userModel.find({});
        if (!allUsers) {
            res.status(404).send(`no users found`)
            return
        }
        res.status(200).send(allUsers);
    }
    else{
        res.status(400).json({error: 'customer can not view details of all users'});
    }
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
}

/*
export const getUserByUserName = async (req, res) => {
    const userName = req.query.username;
    try {
        const user = await userModel.findOne({ username: userName });
        if (!user) {
            res.status(404).send(`user with username: ${userName} not found`)
            return
        }
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
}
*/

