import React, { useContext } from 'react';
// import './NavigationBar.css';
import { AppBar, Badge, Button, Link, Toolbar, Typography } from '@mui/material';
import { useCurrentUserDetails, useCurrentUserOffers, useIsAdmin } from '../../common/hooks';
import { AuthDataContext } from '../../App';
import { useNavigate } from 'react-router-dom';




function NavigationBar() {
  const { user, token, isLoading } = useCurrentUserDetails()
  const { removeAuthData } = useContext(AuthDataContext)
  const { offers, isLoading: offersLoading, refresh, isValidating: offersUpdating } = useCurrentUserOffers(true)
  const isAdmin = useIsAdmin()
  const navigate = useNavigate();

  const handleLogout = () => {
    //localStorage.removeItem("auth")
    removeAuthData()
    navigate('/home');
  }

  return (
    <AppBar
      position="sticky"
      color="default"

    // elevation={3}
    // sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h4" color="inherit" noWrap sx={{ flexGrow: 1, fontFamily: "Didot", textTransform: "uppercase" }}>
          Sycle
        </Typography>
        <Link
          variant="button"
          color="text.primary"
          underline="hover"
          href="/home"
          sx={{ my: 1, mx: 1.5 }}
        >
          Home
        </Link>
        {user && isAdmin && <Link
          variant="button"
          color="text.primary"
          underline="hover"
          href="/admin/"
          sx={{ my: 1, mx: 1.5 }}
        >
          Admin
        </Link>}
        {user && !isAdmin && <Badge badgeContent={offers?.length} color="secondary" overlap="circular">
          {user && !isAdmin && <Link
            variant="button"
            color="text.primary"
            underline="hover"
            href="/offers"
            sx={{ my: 1, mx: 1.5 }}
          >
            Offers
          </Link>}
        </Badge>}
        {user && <Link
          variant="button"
          color="text.primary"
          href= {isAdmin ? "/add-product" : "/add-product"}
          underline="hover"
          sx={{ my: 1, mx: 1.5 }}
        >
          Add Product
        </Link>}
        <Link
          variant="button"
          color="text.primary"
          href="/about-us"
          underline="hover"
          sx={{ my: 1, mx: 1.5 }}
        >
          About Us
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/contact-us"
          underline="hover"
          sx={{ my: 1, mx: 1.5 }}
        >
          Contact Us
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/signup"
          underline="hover"
          sx={{ my: 1, mx: 1.5 }}
        >
        </Link>
        {user ?
        <>
          <Button onClick={handleLogout} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Logout
          </Button>
          {user && 
            <Button  href={`/profile/${user._id}`} variant="contained" sx={{ my: 1, mx: 1.5 }}>
            My Profile
          </Button>
          }
          </>
          :
          <>
            <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
              Login
            </Button>
            <Button href="/signup" variant="contained" sx={{ my: 1, mx: 1.5 }}>
              Sign Up
            </Button>
          </>}
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar;
