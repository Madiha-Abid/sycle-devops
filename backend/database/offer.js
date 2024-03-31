import mongoose from "mongoose";
import { isUserAdmin, isUserCustomer } from "../Connection&Contoller/authMiddleware.js";
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  sellerId: {
    type:String,
  },
  buyerId: {
    type:String,
    required:[true, 'Please enter a buyerId'],

  },
  productId: {
    type:String,
    required:[true, 'Please enter a productId'],

  },
  offerPrice: {
    type: Number,
    required:[true, 'Please enter a price'],

  },
  offerStatus: {
    type: String,
    enum: ['pending', 'approved', 'denied', 'canceled_by_buyer', 'accepted_by_buyer'],
    default: 'pending'
  },
  created_on: {
    type: Date,
  },
  updated_on: {
    type: Date,
  }
});

export const offerPermisionsChecker = {
  add: (parameters, currentUser) => {
    if(isUserAdmin(currentUser)){
      return{
        allowed: false,
        error: 'admin can not make offers'
      }
    }
    if(isUserCustomer(currentUser)){
      if(parameters.buyerId !== currentUser._id.toString()){
        return{
          allowed: false,
          error: 'buyerId not the same as current user Id'
        }
      }
      if(parameters.buyerId === currentUser._id.toString() && !parameters.productId){
        return{
          allowed: false,
          error: 'buyer has not specified a valid productId'
        }
      }
      if(parameters.buyerId === currentUser._id.toString() && isNaN(parameters.offerPrice)){
        return{
          allowed: false,
          error: 'buyer has not specified a valid price'
        }
      }
    }
        return {
          allowed: true
        }
  },
  edit: (parameters, currentUser, offer) => {
    if(isUserCustomer(currentUser)){
      if(offer && offer.buyerId === currentUser._id.toString() && (parameters.status !== 'accepted_by_buyer', 'canceled_by_buyer')){
        return{
          allowed: false,
          error: 'buyer can not update status'
        }
      }
      if(offer && offer.seller === currentUser._id.toString() && (parameters.status !== 'denied', 'approved')){
        return{
          allowed: false,
          error: 'seller can not update status'
        }
      }
    }
    if(isUserAdmin(currentUser)){
      return{
        allowed: false,
        error: 'admin can not edit offers'
      }
    }
      return {
          allowed: true
      }
  },
  // delete: (parameters, currentUser, offer) => {
  //     return {
  //         allowed: true,
  //     }

  // },
  get: (parameters, currentUser) => {
    if(isUserCustomer(currentUser)){
      if((parameters.sellerId && parameters.sellerId !== currentUser._id.toString()) || (parameters.buyerId && parameters.buyerId !== currentUser._id.toString())){
        // if(parameters.buyerId !== currentUser._id.toString()){
        return{
          allowed: false,
          error: 'current userId does not match with sellerId or buyerId'
        }
      // }
    }
    else if(!parameters.sellerId && !parameters.buyerId){
      return{
        allowed: false,
        error: 'user can not view all offers'
      }
    }
  }
    return {
      allowed: true
    }
  }
} 

// // define a pre('updateMany') middleware function
// offerSchema.pre('updateMany', function(next) {
//   // perform any custom processing here
//   console.log('Before updateMany');
//   next();
// });

// // define a post('updateMany') middleware function
// offerSchema.post('updateMany', function(result) {
//   // perform any custom processing here
//   console.log(result.nModified + ' documents were updated');
// });

export const offerModel = mongoose.model('offer', offerSchema);