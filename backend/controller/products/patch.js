import { productModel, productPermissionsChecker } from "../../database/product.js";
import mongoose from "mongoose";


// This function updates a product in the database
const updateProduct = async (req, res) => {
  const updates = req.body;
  const updated = { ...updates, "updated_on": Date.now() };
  const productId = req.params.id;

  // Check if the current user has permission to edit the product
  let product = await productModel.findOne({ _id: productId });
  const permission = productPermissionsChecker.edit(req.body, req.user, product);

  if (permission.allowed) {
    // Check if the productId is a valid object id
    if (mongoose.isValidObjectId(productId)) {
      // Update the product in the database with the new data
      productModel
        .updateOne({ _id: productId }, { $set: updated })
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Could not update document' });
        });
    } else {
      res.status(500).json({ error: 'Not a valid ID' });
    }
  } else {
    // If the user does not have permission to edit the product, return an error message
    res.status(400).json({ error: permission.error });
  }
};

export { updateProduct }


