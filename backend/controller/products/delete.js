import { offerModel } from "../../database/offer.js";
import { productModel, productPermissionsChecker } from "../../database/product.js";
import mongoose from "mongoose";

const updateofferdelete = async (req, res) => {
    const productId = req.params.id;
    const offers = await offerModel.find({ productId: productId });
    for (const offer of offers) {
      const updateResult = await offerModel.updateOne({ _id: offer._id }, { $set: { offerStatus: 'pending' } });
      if (updateResult.modifiedCount === 0) {
        return res.status(500).json({ error: 'Failed to update offer' });
      }
    }  
    res.send("hogaya kam")
}

const deleteProduct = async (req, res) => {
  let product = null;
  // Check if the user has permission to delete the product
  const permission = productPermissionsChecker.delete(req.user, product);  
  try {
    if (permission.allowed) {
      // Get the product ID from the request parameters
      const productId = req.params.id;
      // Find the product in the database
      if (mongoose.isValidObjectId(productId)) {
        product = await productModel.findOne({ _id: productId });
    }
      if (!product) {
        // If the product does not exist, return a 404 error
        return res.status(404).json({ error: 'Product not found' });
      }
      if (product.status === 'sold') {
        // If the product has already been sold, return a 400 error
        return res.status(400).json({ error: 'Product has already been sold' });
      }
  
      // Get offers for the product and update their offerStatus to 'denied'
      const offers = await offerModel.find({ productId: productId });
      for (const offer of offers) {
        const updateResult = await offerModel.updateOne({ _id: offer._id }, { $set: { offerStatus: 'denied' } });
        if (updateResult.modifiedCount === 0) {
          // If the offer was not updated, return a 500 error
          return res.status(500).json({ error: 'Failed to update offer' });
        }
      }
  
      // Delete the product from the database
      const deleteResult = await productModel.deleteOne({ _id: productId});
      if (deleteResult.deletedCount === 0) {
        // If the product was not deleted, return a 500 error
        return res.status(500).json({ error: 'Failed to delete product' });
      }
      // If everything succeeded, return a success message
      return res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      // If the user does not have permission to delete the product, return a 400 error with the error message
      res.status(400).json({error: permission.error });
    }
  } catch (err) {
    // If there was an error, return a 500 error
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


  
  export {deleteProduct, updateofferdelete}