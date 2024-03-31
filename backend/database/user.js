import mongoose from "mongoose";
import { productModel } from "./product.js";
const Schema = mongoose.Schema;
import validator from "validator";
import bcrypt from 'bcrypt';


import { isUserAdmin, isUserCustomer } from "../Connection&Contoller/authMiddleware.js";

const userSchema = new Schema({
  userRole: {
    type: String,
    enum: ['admin', 'customer'],
    required: false,
    default: 'customer'
  },

  username: {
    type: String,
    required: [true, 'Please enter a user name'],
    unique: true
  },
  
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: false,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Please enter password'],
    unique: false,
    minlength: 6
  },

  address: {
    street_address: String,
    city: String,
    province: String,
    country: String,
    postal_code: String
  },

  location: {
    type: {
      type: String,
      //enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],       
      required: true
    }
  },
  // points: {
  //   type: {
  //     type: String, // Don't do `{ location: { type: String } }`
  //     enum: ["Point"], // 'location.type' must be 'Point'
  //     required: true,
  //   },

  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },

  phone: {
    type: String,
    required: [true, 'Please enter a phone number'],
    minlength: 11
  },

  listedProducts: {
    type: [String],
    required: false
  },

  purchasedProducts: {
    type: [String],
    required: false
  },

  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  }
});


// @ts-ignore
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//static method to login user
userSchema.statics.login = async function (username, password) {
  // @ts-ignore
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
}

export const userPermissionsChecker = {
//   add: (parameters, user) => {
// // no permissions required for adding a user
//   },
  edit: (parameters, currentUser, user) => {
      if(isUserCustomer(currentUser)){
        if(parameters.id !== currentUser._id.toString()){
          return {
            allowed: false,
            error: 'user can only edit their own details'
          }
        } 
      }
      return{
        allowed: true
      }
  },
  delete: (parameters, currentUser, user) => {
    if(isUserCustomer(currentUser)){
      if(parameters.id !== currentUser._id.toString()){
        return {
          allowed: false,
          error: 'user can only delete their own details'
        }
      } 
    }
    return{
      allowed: true
    }
  },
  get: (parameters, currentUser) => {
    if(isUserCustomer(currentUser)){
      if(parameters.id !== currentUser._id.toString()){
        return{
          allowed: false,
          error: 'user can only view their own details'
        }
      }
    }
    return {
      allowed: true
    }
  }
}

userSchema.index({ location: '2dsphere' });

export const userModel = mongoose.model("user", userSchema);

