
import geoip from 'geoip-lite';
import { handleErrorsProduct, isUserAdmin, isUserCustomer } from "../../Connection&Contoller/authMiddleware.js";
import { productModel, productPermissionsChecker } from "../../database/product.js"
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // save the uploaded image in the 'public/images' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // use the current timestamp as the filename to prevent overwriting existing files
  }
});


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25 // 25 MB
  }
});


function saveProduct(req, res) {
  try {
    console.log("Product post request received", req.body)
    const permission = productPermissionsChecker.add(req.body, req.user);
    if (permission.allowed) {
    upload.single('image')(req, res, async function (err) {
      console.log("Product post request received 1", req.body)
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        const coordinates = [160.000, -79.000]; // location.ll;
        const denver = { type: 'Point', coordinates: coordinates };
        const filepath = `images/${req.file.filename}`;
        const contentType = `image/${req.file.filename.split(".").pop()}`;
        console.log(req.body.sellerId +" and "+ req.user._id)
        const product = new productModel({
          name: req.body.name,
          sellerId: req.body.sellerId,
          address: JSON.parse(req.body.address),
          location: denver,
          description: req.body.description,
          category: req.body.category,
          subCategory: req.body.subCategory,
          price: req.body.price,
          condition: req.body.condition,
          size: req.body.size,
          brand: req.body.brand,
          colour: req.body.colour,
          image: { 
            name: req.file.filename,
            img: {
              data: fs.readFileSync(filepath),
              contentType: contentType
            }
           },// save the filename of the uploaded image in the 'image' field of the product document
          status: req.body.status
        });

        let result = await product.save();
        console.log(result);
        res.send(result)
        //next(); // call the next middleware function, which is the post hook to save the image
      }
    });
    } else {
     res.status(400).json({ error: permission.error });
    }
  }
  catch (error) {
    const errors = handleErrorsProduct(error);
    res.status(500).json({ errors });
  }
}







/* 
function saveProduct(req, res) {
  try {
    // const permission = productPermissionsChecker.add(req.body, req.user);
    //if (true) {
    upload.single('image')(req, res, async function (err) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        const coordinates = [160.000, -79.000]; // location.ll;
        const denver = { type: 'Point', coordinates: coordinates };
        const product = new productModel({
          name: req.body.name,
          sellerId: req.body.sellerId,
          address: {
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            postalCode: req.body.postalCode
          },
          location: denver,
          description: req.body.description,
          category: req.body.category,
          subCategory: req.body.subCategory,
          price: req.body.price,
          condition: req.body.condition,
          size: req.body.size,
          brand: req.body.brand,
          colour: req.body.colour,
          image: req.file.filename, // save the filename of the uploaded image in the 'image' field of the product document
          status: req.body.status
        });

        let result = await product.save();
        console.log(result);
        //next(); // call the next middleware function, which is the post hook to save the image
      }
    });
    //} else {
    //  res.status(400).json({ error: permission.error });
    //}
  }
  catch (error) {
    const errors = handleErrorsProduct(error);
    res.status(500).json({ errors });
  }
}








function saveImage(filename, callback) {
  const filepath = `images/${filename}`;
  const contentType = `image/${filename.split(".").pop()}`;
  
  const image = new imageModel({
    name: filename,
    img: {
      data: fs.readFileSync(filepath),
      contentType: contentType,
    },
  });
  
  image.save()
    .then(() => {
      console.log(`Image ${filename} saved to database`);
      callback();
    })
    .catch((err) => {
      console.error(`Error saving image ${filename}:`, err);
      callback(err);
    });
}


 */

export { saveProduct };

/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // save the uploaded image in the 'public/images' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // use the current timestamp as the filename to prevent overwriting existing files
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25 // 25 MB
  }
});

function saveProduct(req, res) {
  try {
    // const permission = productPermissionsChecker.add(req.body, req.user);
    //if (true) {
    upload.single('image')(req, res, async function (err) {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        const coordinates = [160.000, -79.000]; // location.ll;
        const denver = { type: 'Point', coordinates: coordinates };
        const product = new productModel({
          name: req.body.name,
          sellerId: req.body.sellerId,
          address: {
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            postalCode: req.body.postalCode
          },
          location: denver,
          description: req.body.description,
          category: req.body.category,
          subCategory: req.body.subCategory,
          price: req.body.price,
          condition: req.body.condition,
          size: req.body.size,
          brand: req.body.brand,
          colour: req.body.colour,
          image: req.file.filename, // save the filename of the uploaded image in the 'image' field of the product document
          status: req.body.status
        });

        let result = await product.save();
        console.log(result);
        res.json(result);
      }
    });
    //} else {
    //  res.status(400).json({ error: permission.error });
    //}
  }
  catch (error) {
    const errors = handleErrorsProduct(error);
    res.status(500).json({ errors });
  }
}


export { saveProduct }; */


