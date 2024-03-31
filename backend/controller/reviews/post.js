import { offerModel } from "../../database/offer.js";
import { reviewModel, reviewPermissionsChecker } from "../../database/review.js";
// @ts-ignore
import { handleErrorsReview } from "../../Connection&Contoller/authMiddleware.js";
import { productModel } from "../../database/product.js";
import mongoose from "mongoose";
import { userModel } from "../../database/user.js";

/**
 * Saves a review for a transaction if the offer is accepted by the buyer
 * @param {Object} req - The request object
 * @param {Object} req.body - The review data to be saved
 * @param {Object} res - The response object
 */

export const saveReview = async (req, res) => {
  // @ts-ignore
  const permission = reviewPermissionsChecker.add(req.body, req.user);
  const { productId, buyerId, reviews, rating } = req.body;
  console.log(req.body);
  // @ts-ignore
  console.log(req.user);  
  console.log(reviews, rating)
  try {
      console.log(`productId: ${productId} buyerId: ${buyerId} reviews: ${reviews} rating: ${rating}`);
      if(permission.allowed){
      let out = null;
      // @ts-ignore
      const output = await mongoose.connection.transaction(async (session) => {
          let buyer = null;
          if (mongoose.isValidObjectId(buyerId)) {
              buyer = await userModel.findOne({ _id: buyerId }).session(session);
          }
          if (buyer === null) {
              throw new Error('buyer_not_exists');
          }
          let product = null;
          if (mongoose.isValidObjectId(productId)) {
              product = await productModel.findOne({ _id: productId }).session(session);
          }
          if (product === null) {
              throw new Error('product_not_exists');
          }
          let offer = null;
          if(mongoose.isValidObjectId(productId) && mongoose.isValidObjectId(buyerId)){
             offer = await offerModel.findOne({sellerId: product.sellerId, buyerId: buyerId, productId: productId, offerStatus:'accepted_by_buyer'}).session(session);
          }
          if(offer === null){
             throw new Error('Not_eligible');
          }
          let review = null;
          if (mongoose.isValidObjectId(buyerId)) {
            review = await reviewModel.findOne({ sellerId: product.sellerId, buyerId: buyerId, productId: productId}).session(session);
          }
          if (review !== null) {
            throw new Error('review_exist');
          }
          let result = await reviewModel.create([{ sellerId: product.sellerId, buyerId: buyerId, productId: productId, reviews: reviews, rating:rating }], {session: session});
          console.log(result);
          out = result[0];
          return result[0];
      });
      res.send(out);
  }
  else{
      res.status(400).json({error: permission.error});
  }
  } catch (err) {
      console.error(err);
      switch (err.message) {
          case 'buyer_not_exists':
              res.status(404).send(`buyer with id: ${buyerId} does not exist`);
              break;
          case 'product_not_exists':
              res.status(404).send(`product with id: ${productId} does not exist`);
              break;
          case 'Not_eligible':
                res.status(404).send(`Buyer with id: ${buyerId} is not eligible to rate this seller!`);
                break;
          case 'review_exist':
                res.status(404).send(`Buyer with id: ${buyerId} as already reviewed this seller and product!`);
                break;
          default:
              res.status(500).send('unknown error occurred');    
      }
  }
}

