import express from 'express';
import { saveProduct} from '../controller/products/post.js'
import { saveReview } from '../controller/reviews/post.js';
import { getProductById, getProductbyIds, getProducts, getProductNearUser} from '../controller/products/get.js'
import { logout, login_post , saveUser } from '../controller/users/auth.js'
import { getOffers } from '../controller/offers/get.js';
import { deleteUserAndUpdateStatuses } from '../controller/users/delete.js';
import { getAllUsers, getUserById, getUsersByLocation} from '../controller/users/get.js';
import { getReviews, getSellerRating } from '../controller/reviews/get.js';
import { addOffer } from '../controller/offers/post.js';
import { changeOfferStatus } from '../controller/offers/patch.js';
import { deleteProduct , updateofferdelete } from '../controller/products/delete.js';
import { requireAuth, fetchUserById, appendUserData, checkAdminRole, checkCustomerRole } from './authMiddleware.js';
import { updateProduct } from '../controller/products/patch.js';
import { updateUserById } from '../controller/users/patch.js';
import { deleteReview } from '../controller/reviews/delete.js';
import { updateReview } from '../controller/reviews/patch.js';
 
// Creating a router object
const customerRouter = express.Router();
const adminRouter = express.Router();
const commonRouter = express.Router();

// ***************** Hashir *****************

//Customer routes
//***************** products **************

// Add a new product
customerRouter.post('/customer/add-new-product', requireAuth, appendUserData, checkCustomerRole, saveProduct);

//commonRouter.post('/customer/addnewproduct', requireAuth, appendUserData, checkCustomerRole, saveProduct);
// commonRouter.post('/customer/addnewproduct',  saveProduct);  
// commonRouter.post('/test', saveImage);
// Get products near a user
customerRouter.get('/customer/product-near-user/:id/', requireAuth, appendUserData, checkCustomerRole, getProductNearUser);

// Update product details
customerRouter.patch('/customer/update-product-details/:id', requireAuth, appendUserData, checkCustomerRole,  updateProduct);

// Delete a product
customerRouter.delete('/customer/delete-product/:id', requireAuth, appendUserData, checkCustomerRole, deleteProduct);
//***************** users **************

// Get users based on user location
customerRouter.get('/customer/location/:id/',  requireAuth, appendUserData, checkCustomerRole, getUsersByLocation);

//***************** reviews **************

// Add a review
customerRouter.post('/customer/add-review', requireAuth, appendUserData, checkCustomerRole, saveReview);

// update a review
customerRouter.patch('/customer/update-review/:id', requireAuth, appendUserData , checkCustomerRole, updateReview);  

// delete a review
customerRouter.delete('/customer/delete-review/:id', requireAuth, appendUserData, checkCustomerRole, deleteReview);
//***************** offers **************

//Admin routes
//***************** products **************

//Add new product
adminRouter.post('/admin/add-new-product', requireAuth, appendUserData, checkAdminRole, saveProduct);

// update product 
adminRouter.patch('/admin/update-product-details/:id', requireAuth, appendUserData, checkAdminRole,  updateProduct);

//delete product
adminRouter.delete('/admin/delete-product/:id', requireAuth, appendUserData, checkAdminRole, deleteProduct);

//***************** reviews **************

//update review
adminRouter.patch('/admin/update-review/:id', requireAuth, appendUserData , checkAdminRole, updateReview); 

//delete review
adminRouter.delete('/admin/delete-review/:id', requireAuth, appendUserData, checkAdminRole ,deleteReview);

//Common routes
//***************** reviews **************

// get buyer rating
commonRouter.get('/get-seller-rating/', getSellerRating );   
//***************** offers **************

      

// User authentication and verification

 // Create a new user
commonRouter.post('/signup', saveUser);

// Login with an existing user
commonRouter.post('/login', login_post); 

// Logout the current user
commonRouter.get('/logout', logout); 

 
//***************** Madiha *****************

// Admin Routes:

//***************** Offer *****************

// Get all offers - admin
adminRouter.get('/admin/offers', requireAuth, appendUserData, checkAdminRole, getOffers);

//***************** User *****************

// Delete a user and update related data-admin
adminRouter.delete('/admin/delete-user/:id', requireAuth, appendUserData, checkAdminRole, deleteUserAndUpdateStatuses);

// Get a single user by ID - admin
adminRouter.get('/admin/user/:id', requireAuth, appendUserData, checkAdminRole, getUserById);

// Update user information by ID - admin
adminRouter.patch('/admin/update-user/:id', requireAuth, appendUserData, checkAdminRole, updateUserById);

// Get all users
adminRouter.get('/admin/users', requireAuth, appendUserData, checkAdminRole, getAllUsers);

// Customer Routes:

//***************** Offer *****************

// Get offers of authorized customer only
customerRouter.get('/customer/offers', requireAuth, appendUserData, checkCustomerRole, getOffers);

// Add a new offer
customerRouter.post('/customer/add-offer', requireAuth, appendUserData, checkCustomerRole, addOffer);

// Change the status of an offer
customerRouter.patch('/customer/update-offer/:id', requireAuth, appendUserData, checkCustomerRole, changeOfferStatus);

//***************** User *****************

// Delete a user and update related data-customer
customerRouter.delete('/customer/delete-user/:id', requireAuth, appendUserData, checkCustomerRole, deleteUserAndUpdateStatuses);

// Get a single user by ID - customer
customerRouter.get('/customer/user/:id', requireAuth, appendUserData, checkCustomerRole, getUserById);

// Update user information by ID - customer
customerRouter.patch('/customer/update-user/:id', requireAuth, appendUserData, checkCustomerRole, updateUserById);
//Common Routes:

//***************** Product *****************
  
// Get all products
commonRouter.get('/products', getProducts);

// Get a single product by product ID
commonRouter.get('/product/:id', getProductById);

// Get multiple products by their IDs
commonRouter.get('/products/multiple/:ids', getProductbyIds);

//***************** Review *****************

// Get reviews
commonRouter.get('/reviews', getReviews);


//module.exports = router;
export { customerRouter, adminRouter, commonRouter };  