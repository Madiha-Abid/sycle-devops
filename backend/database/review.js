import mongoose from "mongoose";
import { isUserAdmin, isUserCustomer } from "../Connection&Contoller/authMiddleware.js";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  sellerId: { 
    type: String,
    required: [true,'Please enter seller ID']
  },
  buyerId:  { 
    type: String,
    required: [true,'Please enter buyer ID']
  },
  productId:  { 
    type: String,
    required: [true,'Please enter product ID']
  },
  reviews:  { 
    type: String,
    required: [true,'Please enter review body']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
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
  
export const reviewPermissionsChecker = {
  add: (parameters, currentUser) => {
    if(isUserAdmin(currentUser)){
        if(!parameters.buyerId){
          return {
            allowed: false,
            error: 'admin must specify buyerId'
          };
        }
        console.log(`userId: ${currentUser._id} buyerId: ${parameters.buyerId} `)
        console.log(parameters.sellerId === currentUser._id.toString());
        if(parameters.buyerId === currentUser._id.toString()){    
          return {
            allowed: false,
            error: 'admin can not add review with their own id'
          };
        }
      }
      if(isUserCustomer(currentUser)){
        if(parameters.buyerId !== currentUser._id.toString()){
          return {
            allowed: false,
            error: 'buyerId not specified or buyerId not the same as customerId'
          };
        } 
      }
      return {
        allowed: true
      }
},
  get: (parameters, currentUser) => {
        return {
          allowed: true
        }
  },
  delete: (currentUser, review) =>{
    if(isUserAdmin(currentUser)){
      return {
        allowed:true
      }
    }
    if(isUserCustomer(currentUser)){
    if(review && review.buyerId !== currentUser._id.toString()){
      return {
          allowed:false,
          error: 'Not the creater of the review'
      };
    }
    return {
      allowed: true
    }
  }
  },
  update: (currentUser, review) =>{
    if(isUserAdmin(currentUser)){
      if(!review.buyerId){
        return {
          allowed: false,
          error: 'admin must specify buyerId'
        };
      }
      console.log(`userId: ${currentUser._id} buyerId: ${review.buyerId} `)
      console.log(review.buyerId=== currentUser._id.toString());
      if(review.buyerId === currentUser._id.toString()){    
        return {
          allowed: false,
          error: 'admin can not update review with their own id'
        };
      }
    }
    if(isUserCustomer(currentUser)){
    if(review && review.buyerId !== currentUser._id.toString()){
      return {
          allowed:false,
          error: 'Not the creater of the review'
      };
    }
    return {
      allowed: true
    }
  }
}
}

export const reviewModel = mongoose.model('review', reviewSchema);