import mongoose from "mongoose";
import { offerModel } from "../../database/offer.js";
import { productModel } from "../../database/product.js";
import { userModel, userPermissionsChecker } from "../../database/user.js"

export const deleteUserAndUpdateStatuses = async (req, res) => {
    // parameters = userId
    const permission = userPermissionsChecker.delete(req.params, req.user)
    const userId  = req.params.id;
    console.log(`userId: ${userId}`);
    try {
        if(permission.allowed){
        await mongoose.connection.transaction(async (session) => {
            console.log('debugging')
            let user = null;
            if (mongoose.isValidObjectId(userId)) {
                user = await userModel.findOne({ _id: userId }).session(session);
            }
            console.log(user);
            if (user === null) {
                throw new Error('user_not_valid');
            }
            await productModel.findOneAndDelete({ $and: [{ sellerId: userId }, { status: 'unsold' }] }).session(session);

            await offerModel.updateMany({
                $and: [
                    { sellerId: userId },
                    { $or: [{ offerStatus: 'pending' }, { offerStatus: 'approved' }] }
                ]
            }, { offerStatus: 'denied' }).session(session);

            await offerModel.updateMany({
                $and: [
                    { buyerId: userId },
                    { $or: [{ offerStatus: 'pending' }, { offerStatus: 'approved' }] }
                ]
            }, { offerStatus: 'canceled_by_buyer' }).session(session);
        });
        const output = await userModel.findOneAndDelete({ _id: userId });
        console.log(output);
        res.send(output);
        }
        else{
            res.status(400).json(permission.error);
        }
    } catch (err) {
        switch (err.message) {
            case 'user_not_valid':
                res.status(404).send(`userId: ${userId} does not exist`);
                break;
            default:
                res.status(500).send('unknown error occurred');
        }
    }
}

/*
const getUserInfo = async (userName) => {
    const user = await userModel.findOne({ username: userName });
    if (!user) {
        return null
    }
    return {
        sellerId: user._id
    }
}
*/

/*
export const deleteUserByUserName = async (req, res) => {
    const userName = req.query.username;
    const userInfo = getUserInfo(userName);
    const removeUser = await userModel.findOneAndDelete({ username: userName });
    try {
        if (!removeUser) {
            res.status(404).send(`user with username: ${userName} not found`)
            return
        }
        if (await productModel.exists(userInfo)) {
            const removeProduct = await productModel.deleteMany(userInfo);
            res.send(`all entries of userId: ${userName} deleted from user and product table`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
}
*/

