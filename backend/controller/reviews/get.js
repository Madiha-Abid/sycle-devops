import mongoose from "mongoose";
import { reviewModel, reviewPermissionsChecker } from "../../database/review.js";
import { buildQueryObject } from "../common/helper.js";

export const getReviews = async (req,res) => {
    // const permission = reviewPermissionsChecker.get(req.query, req.user);
    const parameters = ['sellerId', 'buyerId', 'productId'];
    const queryObject = buildQueryObject(req.query, parameters);
    console.log(queryObject);
    try {
        const reviews = await reviewModel.find(queryObject).sort({ created_on: -1 });
        // console.log(reviews)
        res.status(201).send(reviews);
        
    } catch (err) {
        console.error(err);
        res.status(400).send("error occured");
    }
};

export const getSellerRating = async (req, res) => {
    try {
        const sellerId = req.query.id;
        if(mongoose.isValidObjectId(sellerId)){
        const reviews = await reviewModel.find({sellerId:sellerId});
        if (reviews === null || !reviews.length){
            res.json("No Reviews Exist for this Seller");
            return
        }
        else{
        const avg = reviews.reduce((acc, val) => acc + val.rating, 0) / reviews.length;
        // Loop through each review and calculate the total rating
        // for (const review of reviews) {
        //     // Convert the review rating from a string to a number using parseInt
        //     rating.push(Number(review.rating));
        //      avg = rating.reduce((acc, val) => acc + val, 0) / rating.length;  
        // } 
        // Return the rating as a JSON response
        res.json({averageRating: avg});
    }
}
    else{
        throw new Error('Seller_not_exists');
    }
    } catch (err) {
        // Handle any errors and return a 500 error response
        console.error(err);
      switch (err.message) {
          case 'Seller_not_exists':
              res.status(404).send(`Seller with id does not exist`);
              break;
          default:
              res.status(500).send('unknown error occurred'); 
    }
}
}
