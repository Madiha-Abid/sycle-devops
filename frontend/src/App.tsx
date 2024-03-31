import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import NavigationBar from './components/navigation/nav'
import Home from './components/home/home'
import LoginForm from './components/login/login'
import SignupForm from './components/signup/signup'
import ProductForm from './components/product/product-form'
import ProductDetails from './components/product/product-details'
import UserInformation from './components/user/user-dashboard'
import { createContext, useEffect, useState } from 'react'
import { AuthData } from './models/models'
import OfferDetails from './components/offer/offer-details'
import IProductInformation from './components/product/product-dashboard'
import AdminDashboard from './components/Admin/admin-dashboard'
import AdminProductInformation from './components/Admin/admin-product-dashboard'
import AdminUserInformation from './components/Admin/admin-user-dashboard'
import ScrollContainer from './common/hooks'
import AboutUs from './components/home/about-us'
import ContactUs from './components/home/contact-us'
// window.Buffer = window.Buffer || require("buffer").Buffer; 

type AuthDataContextData = {
  authData?: AuthData,
  setAuthData: (value: AuthData) => void,
  removeAuthData: () => void
}

export const AuthDataContext = createContext<AuthDataContextData>({
  setAuthData: () => { },
  removeAuthData: () => { },
})

const removeAuthDataStorage = () => {
  localStorage.removeItem('auth')
}

const getAuthDataStorage = (): AuthData | undefined => {
  const authDataString = localStorage.getItem('auth')

  // console.log('authstring', authDataString)
  if (authDataString) {
    try {
      return (JSON.parse(authDataString))
    } catch (e) {
      console.error('unable to parse authData', authDataString)
    }
  }
  else {
    // console.log('authDataString was not set')
  }
}

//if called with undefined user is logged out
const setAuthDataStorage = (authData: any) => {
  localStorage.setItem("auth", JSON.stringify(authData));
}

function App() {

  const [authData, setAuthData] = useState(getAuthDataStorage())

  useEffect(() => {
    if (authData) {
      setAuthDataStorage(authData)
    }

  }, [authData])

  const removeAuthData = () => {
    setAuthData(undefined)
    removeAuthDataStorage()
  }

  return (
    <>
      <BrowserRouter>
        <AuthDataContext.Provider
          value={{
            authData,
            setAuthData: setAuthData,
            removeAuthData: removeAuthData,
          }}
        >
          <NavigationBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='/login' element={<LoginForm signUpUrl='/signup' />} />
            <Route path='/signup' element={<SignupForm />} />
            <Route path='/add-product' element={<ProductForm />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path='/profile/:id' element={<UserInformation />} />
            <Route path='/offers' element={<OfferDetails />} />
            <Route path="/product-update/:id" element={<IProductInformation />}/>
            <Route path="/admin/" element={< AdminDashboard />} />
            <Route path='/admin/update-product-details/:id' element={< AdminProductInformation />}/>
            <Route path='/admin/update-user/:id' element={< AdminUserInformation/>}/>
          </Routes>
        </AuthDataContext.Provider>
      </BrowserRouter>
    </>
  )
}

//Admin routes
//***************** products **************

// //Add new product
// adminRouter.post('/admin/add-new-product', requireAuth, appendUserData, checkAdminRole, saveProduct);

// // update product 
// adminRouter.patch('/admin/update-product-details/:id', requireAuth, appendUserData, checkAdminRole,  updateProduct);

// //delete product
// adminRouter.delete('/admin/delete-product/:id', requireAuth, appendUserData, checkAdminRole, deleteProduct);

// //***************** reviews **************

// //update review
// adminRouter.patch('/admin/update-review/:id', requireAuth, appendUserData , checkAdminRole, updateReview); 

// //delete review
// adminRouter.delete('/admin/delete-review/:id', requireAuth, appendUserData, checkAdminRole ,deleteReview);

//***************** Madiha *****************

// Admin Routes:

//***************** Offer *****************

// // Get all offers - admin
// adminRouter.get('/admin/offers', requireAuth, appendUserData, checkAdminRole, getOffers);

// //***************** User *****************

// // Delete a user and update related data-admin
// adminRouter.delete('/admin/delete-user/:id', requireAuth, appendUserData, checkAdminRole, deleteUserAndUpdateStatuses);

// // Get a single user by ID - admin
// adminRouter.get('/admin/user/:id', requireAuth, appendUserData, checkAdminRole, getUserById);

// // Update user information by ID - admin
// adminRouter.patch('/admin/update-user/:id', requireAuth, appendUserData, checkAdminRole, updateUserById);

// // Get all users
// adminRouter.get('/admin/users', requireAuth, appendUserData, checkAdminRole, getAllUsers);


export default App
