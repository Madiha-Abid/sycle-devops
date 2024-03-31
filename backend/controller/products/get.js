import mongoose from "mongoose";
import { distance } from "../../Connection&Contoller/authMiddleware.js";
// @ts-ignore
import { customerRouter } from "../../Connection&Contoller/routes.js";
import { productModel } from "../../database/product.js";
import { userModel } from "../../database/user.js";
import { buildQueryObject } from "../common/helper.js";

export const getProducts = async (req, res) => {
    const parameters = ['category', 'subCategory', 'colour', 'size', 'brand', 'status', 'sellerId', 'city', 'pageNumber', 'itemsPerPage'];
    const queryObject = buildQueryObject(req.query, parameters);
    console.log("Received products get request with params", req.query)
    const pageNumber = req.query.pageNumber;
    const itemsPerPage = req.query.itemsPerPage;
    if(queryObject.hasOwnProperty('city')){
        // queryObject.delete('city');
        delete queryObject.city;
    }
    if(queryObject.hasOwnProperty('pageNumber')){
      // queryObject.delete('city');
      delete queryObject.pageNumber;
  }
  if(queryObject.hasOwnProperty('itemsPerPage')){
    // queryObject.delete('city');
    delete queryObject.itemsPerPage;
}
    let city;
    if (req.query.city) {
        city = req.query.city;
        Object.assign(queryObject,{ 'location.city': city })
        // queryObject["location"] = {
        //     city: req.query.city
        // }
    }
    Object.assign(queryObject,{ 'status': 'unsold' });
    try {
        console.log(queryObject);
        const filteredProducts = await productModel.find(queryObject).sort({ created_on: -1 }).skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * itemsPerPage ) : 0 )
        .limit( itemsPerPage ).exec();
        // sort({ created_on: -1 }).where({ status: 'unsold' });
        console.log(filteredProducts);
        res.status(201).send(filteredProducts);
    } catch (err) {
        console.error(err);
        res.status(400).send("unknown error occured");
    }
};

export const getProductById = async (req, res) => {
    // const productID = req.query.productId;
    const productID = req.params.id;

    if (!productID) {
        res.status(404).send(`product id blank or not set`)
        return
    }
    try {
        if (mongoose.isValidObjectId(productID)) {
            const singleProduct = await productModel.findById(productID);
            if (!singleProduct) {
                res.status(404).send(`product with id ${productID} not found`)
                return
            }
            res.send(singleProduct);
        }
        else{
            res.status(404).send(`invalid product id`)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
};


export const getProductbyIds = async (req, res) => {
    // const productIds = req.query.ids.split(',');
    const productIds = req.params.ids.split(',');

    try {
        const products = (await Promise.all(productIds.map(async (id) => {
            try {
                return await productModel.findById(id).exec();
            }
            catch (err) {
                return null;
            }
        }
        ))).filter(product => product);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("unknown error occured")
    }
}


  export const getProductNearUser = async (req, res) => {
    const userId = req.params.id;    
    const radius = req.query.radius;
    try {
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
         throw new Error('user_not_exists');
      }
      // Extract the user's location coordinates
      // @ts-ignore
      const [longitude, latitude] = user.location.coordinates;
      console.log(`User location: ${latitude}, ${longitude}`);
  
      // Find all products
      const products = await productModel.find({});
      
      // Filter products by location
      const output = [];
      products.forEach(product => {
        // @ts-ignore
        const [refLongitude, refLatitude] = product.location.coordinates;
        console.log(`Products location: ${refLatitude}, ${refLongitude}`);
        const d = distance(latitude, longitude, refLatitude, refLongitude);
        console.log('The distance of this product in Kilometers is:'+ d)
        if (d < radius) {  
          output.push(product);
        }
      });      
      if(output.length==0){
        return res.json("No products near by");
      }else{
        return res.send(output);
      }
    } catch (err) {
      // Handle any errors and return a 500 error response
      console.error(err);
    switch (err.message) {
        case 'user_not_exists':
           res.status(404).send(`User with id ${userId} not found`);
            break;
        default:
            res.status(500).send('unknown error occurred'); 
  }
}
};
  