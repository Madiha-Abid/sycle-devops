import mongoose from "mongoose";
import { reviewModel, reviewPermissionsChecker } from "../../database/review.js";


// Delete a review by ID
const deleteReview = async (req, res) => {
    // parameters = userId
    let review = null;
    const reviewId = req.params.id;
    if (mongoose.isValidObjectId(reviewId)) {
        review = await reviewModel.findOne({ _id: reviewId });
    }
    const permission = reviewPermissionsChecker.delete(req.user, review)
    try {
        if(permission.allowed){
        await mongoose.connection.transaction(async (session) => {
            console.log(review);
            if (review === null) {
                throw new Error('not_valid');
            }
            await reviewModel.findOneAndDelete({_id:reviewId}).session(session);
            res.status(200).json("successfully deleted");
        });
        }
        else{
            res.status(400).json(permission.error);
        }
    } catch (err) {
        switch (err.message) {      
            case 'not_valid':
                res.status(404).send(`The review does not exist or Invalid ID provided`);
                break;
            default:
                res.status(500).send('unknown error occurred');
        }
    }
}

  export {deleteReview}  