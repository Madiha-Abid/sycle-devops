import mongoose from "mongoose";
import { offerModel, offerPermisionsChecker } from "../../database/offer.js";
import { productModel } from "../../database/product.js";
import { userModel } from "../../database/user.js";

/*
doing transaction because we want all checks to take place at the same time. 
If the database was being modified through another connection, and that result in
invalid buyer or products, then transaction will not succeed
*/

export const addOffer = async (req, res) => {
    const permission = offerPermisionsChecker.add(req.body, req.user);
    const { productId, buyerId, offerPrice } = req.body;
    console.log(req.body);
    console.log(Number(offerPrice))
    try {
        console.log(`productId: ${productId} buyerId: ${buyerId} price: ${offerPrice}`);
        if (permission.allowed) {
            let out = null;
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
                if (isNaN(offerPrice)) {
                    throw new Error('price_not_valid');
                }
                if (product.status === 'sold') {
                    throw new Error('can_not_make_offer');
                }
                let result = await offerModel.create([{ sellerId: product.sellerId, buyerId: buyerId, productId: productId, offerPrice: Number(offerPrice), created_on: Date.now(), updated_on: Date.now() }], { session: session });
                console.log(result);
                out = result[0];
                return result[0];
            });
            res.send(out);
        }
        else {
            res.status(400).json({ error: permission.error });
        }
    } catch (err) {
        console.error(err);
        switch (err.message) {
            case 'buyer_not_exists':
                //res.status(404).json({error: `buyer with id: ${buyerId} does not exist`})
                res.status(404).send(`buyer with id: ${buyerId} does not exist`);
                break;
            case 'product_not_exists':
                res.status(404).send(`product with id: ${productId} does not exist`);
                break;
            case 'price_not_valid':
                res.status(400).send(`price invalid`);
                break;
            case 'can_not_make_offer':
                res.status(400).send(`user can not make an offer for this product`);
                break;
            default:
                res.status(500).send('unknown error occurred');
        }
    }
}