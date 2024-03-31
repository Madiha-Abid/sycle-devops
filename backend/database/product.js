import mongoose from "mongoose";
import { isUserAdmin, isUserCustomer } from "../Connection&Contoller/authMiddleware.js";
import { userModel } from "./user.js";
const Schema = mongoose.Schema;


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter the product name'],
  },
  sellerId: {
    type: String,
    required: [true, 'Please enter the SellerID name'],
  },
  address: {
    street_address: String,
    city: {
      type: String,
      enum: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Peshawar", "Quetta", "Islamabad", "Sialkot", "Sukkur", "Gujranwala", "Bahawalpur"]
    },
    province: {
      type: String,
      enum: ["Balochistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh"]
    },
    country: {
      type: String,
      default: "Pakistan"
    },
    postal_code: String,
  },
  location: {
    type: {
      type: String,
      // enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  description: String,
  category: {
    type: String,
    enum: ['Mens', 'Women'],
  },
  subCategory: {
    type: String,
    enum: ['Dress', 'Shirt', 'Jeans', 'Ethnic', 'Accessories', 'Shoes'],
  },
  price: Number,
  condition: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please enter price'],
  },
  size: {
    type: String,
  },
  brand: {
    type: String,
    required: [false, 'Please enter the produc brand'],
  },
  colour: {
    type: String,
    enum: ["Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Pink", "Brown", "Gray", "Black", "White", "Teal", "Magenta", "Turquoise", "Lime", "Navy", "Gold", "Silver", "Indigo", "Maroon", "Olive", "Crimson", "Violet", "Fuchsia", "Beige"],
    required: [true, 'Please enter the product colour'],
  },
  image: {
    name: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  status: {
    type: String,
    default: 'unsold',
    enum: ['sold', 'unsold'],
  },
  //store image path relative to server for eg images/cat.png 
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
});

productSchema.post('save', async function () {
  try {
    const id = this.sellerId;
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      throw new Error('User not found');
    }
    await userModel.updateOne({ _id: id }, { $push: { listedProducts: this._id } });
    console.log('Seller updated');
  } catch (err) {
    console.error(err);
  }
});

// productSchema.post('save', function(doc, next) {
//   saveImage(doc.image, function(err) {
//     if (err) return next(err);
//     next();
//   });
// });


export const productPermissionsChecker = {
  add: (parameters, currentUser) => {
    if (isUserAdmin(currentUser)) {
      if (!parameters.sellerId) {
        return {
          allowed: false,
          error: 'admin must specify sellerId'
        };
      }
      console.log(`userId: ${currentUser._id} sellerId: ${parameters.sellerId} `)
      console.log(parameters.sellerId === currentUser._id.toString());
      if (parameters.sellerId === currentUser._id.toString()) {
        return {
          allowed: false,
          error: 'admin can not add product with their own id'
        };
      }
    }
    if (isUserCustomer(currentUser)) {
      if (parameters.sellerId !== currentUser._id.toString()) {
        return {
          allowed: false,
          error: 'sellerId' + parameters.sellerId +'not specified or sellerId not the same as customerId' + currentUser._id.toString()
        };
      }
    }
    return {
      allowed: true
    }
  },
  edit: (parameters, currentUser, product) => {
    if (isUserAdmin(currentUser)) {
      if (parameters.sellerId && parameters.sellerId === currentUser._id.toString()) {
        return {
          allowed: false,
          error: 'admin can not update sellerId with their own id'
        };
      }
    }
    if (isUserCustomer(currentUser)) {
      if (product && product.sellerId !== currentUser._id.toString()) {
        return {
          allowed: false,
          error: 'customer can only modify their own products'
        };
      }
      if (product && product.status === 'sold') {
        return {
          allowed: false,
          error: 'customer can not modify sold product'
        };
      }
    }
    return {
      allowed: true
    }
  },
  delete: (currentUser, product) => {
    if (isUserCustomer(currentUser)) {
      if (product && product.sellerId !== currentUser._id.toString()) {
        return {
          allowed: false,
          error: 'customer can only delete their own products'
        };
      }
      if (product && product.status === 'sold') {
        return {
          allowed: false,
          error: 'customer can not delete sold products'
        };
      }
    }
    return {
      allowed: true,
    }
  }
}

productSchema.index({ location: '2dsphere' });


export const productModel = mongoose.model('product', productSchema);