import { offerModel, offerPermisionsChecker } from "../../database/offer.js";
import { buildQueryObject } from "../common/helper.js";

export const getOffers = async (req, res) => {
    const permission = offerPermisionsChecker.get(req.query, req.user);
    const parameters = ['sellerId', 'buyerId', 'productId'];
    const queryObject = buildQueryObject(req.query, parameters);
    console.log('just a check');
    try {
        console.log('initial check');
        console.log(permission.allowed)
        console.log(queryObject);
        if(permission.allowed){
        console.log('another check')
        const offers = await offerModel.find(queryObject).sort({ created_on: -1 }).exec();
        console.log(offers);
        res.status(201).send(offers);
        }
        else{
            res.status(400).json(permission.error);
        }
    } catch (err) {
        res.status(400).send("unknown error occurred");
    }
};



