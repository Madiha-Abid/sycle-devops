import mongoose from "mongoose";
import { userModel, userPermissionsChecker } from "../../database/user.js";

export const updateUserById = async (req, res) => {
    try {
        const permission = userPermissionsChecker.edit(req.params, req.user);
        if(permission.allowed){
        const userId = req.params.id;
        const {phone, address } = req.body;
        console.log(`userId: ${userId} phone: ${phone} address: ${address}`);

        const update = {};
        if (phone) {
            update.phone = phone;
        }
        if (address) {
            Object.keys(address).forEach((key) => {
                update[`address.${key}`] = address[key];
            });
        }
        update.updated_on = Date.now();
        let updateUser = null;
        if (mongoose.isValidObjectId(userId)) {
            updateUser = await userModel.findOneAndUpdate({ _id: userId }, update, {
                new: true
            });
        }
        if (updateUser === null) {
            res.status(404).send(`user with id ${userId} not found`)
            return
        }
        console.log(updateUser);
        res.status(201).send(updateUser);
    }
    else{
        res.status(400).json({error: permission.error});
        return;
    }
    } catch (err) {
        console.error(err);
        res.status(500).send(`unknown error occured`);
    }
};

