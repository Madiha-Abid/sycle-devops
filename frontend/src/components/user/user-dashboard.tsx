import { Grid, Box, Typography, TextField, Button, Stack, Link, CircularProgress, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ProductCard from "../product/product-card";
import { useCurrentUserDetails, useIsAdmin, useProducts } from "../../common/hooks";
import { User } from "../../models/models";
import { useNavigate, useParams } from "react-router-dom";
import { AuthDataContext } from "../../App";


const UserInformation = () => {

    const [editedUser, setEditedUser] = useState<User | undefined>(undefined);
    const [isUsernameDisabled] = useState<boolean>(true);
    const { user, token, isLoading, refreshUser } = useCurrentUserDetails()
    const isAdmin = useIsAdmin()
    const [successMessage, setSuccessMessage] = useState("");
    const { removeAuthData } = useContext(AuthDataContext)
    const navigate = useNavigate();

    // const fetchUser = async (): Promise<void> => {
    //     try {
    //         const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    //         const { token, user } = authData;

    //         const response = await fetch(
    //             `http://localhost:3005/customer/user/${user}`,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );

    //         if (!response.ok) {
    //             throw new Error("Error fetching user information.");
    //         }

    //         const data = await response.json();
    //         setUser(data);
    //         setProductIds(data.listedProducts || []);
    //         console.log("data " + data)
    //         console.log("listed producsts " + data.listedProducts)
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const { products } = useProducts(user?.listedProducts ?? []);
    const { products: productsPurchased } = useProducts(user?.purchasedProducts ?? []);

    const updateUser = async (): Promise<void> => {
        try {
            // const authData = JSON.parse(localStorage.getItem("auth") || "{}");
            // const { token, user } = authData;

            const response = await fetch(
                `http://localhost:3005/customer/update-user/${user?._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editedUser),
                }
            );

            if (!response.ok) {
                throw new Error("Error updating user information.");
            }

            const data = await response.json();
            refreshUser()

            setSuccessMessage("Successfully Updated")
        } catch (error) {
            console.error(error);
        }
    };


    const deleteUser = async (): Promise<void> => {
        try {

            const authData = JSON.parse(localStorage.getItem("auth") || "{}");
            const { token, user } = authData;
    
            const response = await fetch(
                `http://localhost:3005/customer/delete-user/${user}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
    
            if (!response.ok) {
                throw new Error("Error deleteing user information.");
            }
    
            const data = await response.json();
            setSuccessMessage("successfully deleted");  
            navigate('/home');
            removeAuthData();
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    if (!editedUser) {
        return <Box sx={{ display: 'flex', width: '100%', height: '512px', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>;
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof User | keyof User["address"],
        nestedKey?: "address"
    ) => {
        setEditedUser((prevState) => {
            if (!prevState) {
                return prevState;
            }

            if (nestedKey) {
                return {
                    ...prevState,
                    [nestedKey]: {
                        ...prevState[nestedKey],
                        [key]: e.target.value,
                    },
                };
            }

            return {
                ...prevState,
                [key]: e.target.value,
            };
        });
    };
    return (
        <Grid container spacing={2} marginLeft={8} marginTop={2}>
            <Grid item xs={12} md={6}>
                <Grid container spacing={2} marginLeft={8} marginTop={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" noWrap sx={{ flexGrow: 1, fontFamily: "Didot" }}>
                            Personal details
                        </Typography>
                    </Grid>
              
                    <Grid item xs={12}>

                        <TextField
                            id="outlined-read-only-input"
                            label="Username"
                            value={editedUser.username}
                            onChange={(e) => handleInputChange(e, 'username')}
                            disabled={isUsernameDisabled}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            value={editedUser.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Street Address"
                            value={editedUser.address.street_address}
                            onChange={(e) => handleInputChange(e, 'street_address', 'address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="City"
                            value={editedUser.address.city}
                            onChange={(e) => handleInputChange(e, 'city', 'address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Province"
                            value={editedUser.address.province}
                            onChange={(e) => handleInputChange(e, 'province', 'address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Country"
                            value={editedUser.address.country}
                            onChange={(e) => handleInputChange(e, 'country', 'address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Postal code"
                            value={editedUser.address.postal_code}
                            onChange={(e) => handleInputChange(e, 'postal_code', 'address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Phone"
                            value={editedUser.phone}
                            onChange={(e) => handleInputChange(e, 'phone')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={updateUser}>
                            Save Changes
                        </Button>
                        <Snackbar open={!!successMessage} message={successMessage} />
                    </Grid>
         
                </Grid>
            </Grid>

            {!isAdmin && <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <Typography variant="body1" > <strong>Listed Products</strong> </Typography>
                        {products ? (
                            products.map((listedproduct) => (
                                <Grid item key={listedproduct._id} xs={12} md={2.4}>
                                    <ProductCard product={listedproduct} />
                                    <Button href={`/product-update/${listedproduct._id}`}>Update Product Details</Button>
                                </Grid>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Purchased Products</strong> </Typography>
                {productsPurchased ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            productsPurchased.map((purchasedproduct) => (
                                <Grid
                                    item
                                    key={purchasedproduct._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <ProductCard product={purchasedproduct} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <p>User has not purchased any products.</p>
                )}
            </Grid>
            </Grid>
            </Grid>}
            <Grid item xs={12}>
                <Button variant="contained" onClick={deleteUser} size="medium">
                    Delete Your Account
                </Button>
                 <Snackbar open={!!successMessage} message={successMessage} />
            </Grid>
        </Grid>
    );
};
export default UserInformation;