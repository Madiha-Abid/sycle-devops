import { userModel } from "../../database/user.js";
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import geoip from 'geoip-lite';
import { JWT_SECRET } from "../../constants.js";
import { handleErrors } from "../../Connection&Contoller/authMiddleware.js";

//max age constant
const maxAge = 3 * 24 *60 * 60;


//Madiha
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: maxAge
  });
}

//function to sign up
export const saveUser = async (req, res) => {
    try {
       //1st parameter is always longitude and 2nd one is latitude
      //latitude should be within the range of -90 to 90 
      //longitude should be within the range of -180 to 180.
      //latitude 24--30 want [longtiude,latitude]
      //longitude 67--70 stored[latitude,longitude]
      //const ip = '58.48.196.153';// req.ip; // retrieve the user's IP address from the request
      //const location = geoip.lookup(ip); // look up the user's location using their IP address
      const coordinates = [100.890,38.780]//location.ll; 
      const denver = { type: 'Point', coordinates: coordinates };
      let user = new userModel(req.body);
      user.location = denver;
      let result = await user.save();  
      console.log(result);
      const token = createToken(result._id);
      res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
      res.json(result._id);
    } catch (error) {  
      const errors = handleErrors(error);
    // console.log(error.message, error.code);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).send({ message: 'Email is already taken' });
    }
      res.status(500).json({ errors }); 
    }
  };

  //function to logout
export const logout = async (req, res) => {
   res.cookie('jwt', '', {maxAge: 1});
   res.json({'message':'logged out'}); 
  };


  //funtion to login
export const login_post = async (req, res) => {
   const { username , password } = req.body;
   try{
        // @ts-ignore
        const user = await userModel.login(username,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({ user: user._id, token: token, userRole: user.userRole})
   }
   catch(error){
    const errors = handleErrors(error);
    res.status(400).json({"Error":"Incorrect Usname Or Password"});
   } 
  };
