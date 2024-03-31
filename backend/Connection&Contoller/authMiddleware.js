import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants.js';
import { userModel } from '../database/user.js';
import createError from 'http-errors';
import multer from'multer';




//Madiha 
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log(`trying to decode token ${token}`);
    const decodedToken = jwt.verify(token, JWT_SECRET);
    // @ts-ignore
    console.log(decodedToken);
    req.auth = decodedToken;
    console.log(`userId: ${req.auth.id}`)
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const fetchUserById = async (id) => {
  return await userModel.findById(id);
}

export const appendUserData = async (req, res, next) => {
  try {
    const user = await fetchUserById(req.auth.id);
    if (!user) {
      throw new Error('User is null')
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User does not exist' })
  }
}

export const checkAdminRole = (req, res, next) => {
  if (!isUserAdmin(req.user)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

export const checkCustomerRole = (req, res, next) => {
  if (!isUserCustomer(req.user)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { userRole: '', username: '', email: '', password: '', phone: '' };

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const handleErrorsProduct = (err) => {
  console.log(err.message, err.code);
  let errors = { name: '', sellerID: '', price: '', colour: '', image: '' };

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const handleErrorsReview = (err) => {
  console.log(err.message, err.code);
  let errors = { sellerId: '', buyerId: '', productId: '', reviews: '' };

  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

function distance(lat1, lon1, lat2, lon2) {

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;      

  // calculate the result
  return (c * r);

};



export { distance, handleErrors, handleErrorsProduct, handleErrorsReview }
export const isUserAdmin = (user) => user.userRole === 'admin';
export const isUserCustomer = (user) => user.userRole === 'customer';



