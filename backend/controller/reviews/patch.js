import mongoose from "mongoose";
import { productModel } from "../../database/product.js";
import { reviewModel, reviewPermissionsChecker } from "../../database/review.js";
import { userModel } from "../../database/user.js";


/*
Update review by ID with the provided updates.
@param {object} req - Express request object.
@param {object} res - Express response object.
@returns {object} - Express response object with updated review or error message.
*/
const updateReview = async (req, res) => {
    let review;
    const updates = req.body;
      // Create updated object with updates and current timestamp.
    const updated = { ...updates, "updated_on": Date.now() };
    const reviewId = req.params.id;
    const permission = reviewPermissionsChecker.update(req.user, review);
    console.log(req.body);
    console.log(req.user);  
    try {
        if(permission.allowed){
        let out = null;
        const output = await mongoose.connection.transaction(async (session) => {
            let review = null;
            if (mongoose.isValidObjectId(reviewId)) {
              review = await reviewModel.findOne({_id:reviewId}).session(session);
            }
            if (review === null) {
              throw new Error('review_does_not_exist');
            }
            let buyer = null;
            if (mongoose.isValidObjectId(review.buyerId)) {
                buyer = await userModel.findOne({ _id: review.buyerId }).session(session);
            }
            if (buyer === null) {
                throw new Error('buyer_not_exists');
            }
            let product = null;
            if (mongoose.isValidObjectId(review.productId)) {
                product = await productModel.findOne({ _id: review.productId }).session(session);
            }
            if (product === null) {
                throw new Error('product_not_exists');
            }
            let result = await reviewModel.updateOne({_id:reviewId},{$set:updated}).session(session);
            console.log(result);
            out = result[0];
            return result[0];
        });
        console.log(out);
        res.send('review successfully updated');
    }
    else{
        res.status(400).json({error: permission.error});
    }
    } catch (err) {
        console.error(err);
        switch (err.message) {
            case 'buyer_not_exists':
                res.status(404).send(`This buyer does not exist`);
                break;
            case 'product_not_exists':
                res.status(404).send(`This product  does not exist`);
                break;
            case 'Not_eligible':
                  res.status(404).send(`This Buyer is not eligible to rate this seller!`);
                  break;
            case 'review_does_not_exist':
                  res.status(404).send(`This buyer has not reviewed this seller!`);
                  break;
            default:
                res.status(500).send('unknown error occurred');    
        }
    }
  }
  

  export {updateReview}