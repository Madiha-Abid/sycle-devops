import mongoose from "mongoose";
import { offerModel, offerPermisionsChecker } from "../../database/offer.js";
import { productModel } from "../../database/product.js";
import { userModel } from "../../database/user.js";

const validStatusToPossibleStatus = {
    pending: ['approved', 'denied'],
    approved: ['canceled_by_buyer', 'accepted_by_buyer'],
    canceled_by_buyer: [],
    accepted_by_buyer: [],
    denied: []
}

/*
step 1: check if status exists in possible status map object
//transaction
step 2: check if offer exists
step 3: check if offer can transition to the new status
*/
/*
Mark offer as accepted_by_buyer
At OFFER level
Look at product id, then change status in product table
Change status of the offers of the same product id to denied
Product id added to users table (List of products bought)
*/

export const changeOfferStatus = async (req, res) => {
    // parameters = offerId, status
    let offer = null;
    const permission = offerPermisionsChecker.edit(req.body, req.user, offer);
    const offerId = req.params.id;
    const statusBody = req.body;
    const status = statusBody.offerStatus;
    console.log(JSON.stringify(status));
    // console.log(`offerid: ${offerId} status: ${status}`);
    console.log(status.offerStatus)
    if (!validStatusToPossibleStatus[status]) {
        res.status(400).send(`${status} status invalid`);
        return
    }
    try {
        if(permission.allowed){
        await mongoose.connection.transaction(async (session) => {
            if (mongoose.isValidObjectId(offerId)) {
                offer = await offerModel.findOne({ _id: offerId }).session(session);
            }
            console.log(offer);
            if (offer === null) {
                throw new Error('offer_not_valid');
            }
            if (validStatusToPossibleStatus[offer.offerStatus].includes(status)) {
                if(status === 'accepted_by_buyer'){
                    await offerModel.updateMany({productId: offer.productId}, {offerStatus: 'denied', updated_on: Date.now()}).session(session).exec();
                    await productModel.findOneAndUpdate({_id: offer.productId}, {status: 'sold', updated_on: Date.now()}).session(session);
                    await userModel.findOneAndUpdate({_id: offer.buyerId}, { $push: { purchasedProducts: offer.productId }, updated_on: Date.now()}).session(session);
                }
                offer.offerStatus = status;
                offer.updated_on = Date.now()
                await offer.save({session});
                console.log(offer);
            }
            else{
                throw new Error('status_not_valid');
            }
        })
        
        const output = await offerModel.findOne({ _id: offerId });
        console.log(output);
        res.send(output);
    }
    else{
        res.status(400).json({error: permission.error});

    }
    } catch (err) {
        switch (err.message) {
            case 'offer_not_valid':
                res.status(404).send(`offerId: ${offerId} does not exist`);
                break;
            case 'status_not_valid':
                res.status(400).send(`status cannot be changed to ${status}`);
                break;
            default:
                res.status(500).send('unknown error occurred');
        }
    }

}
