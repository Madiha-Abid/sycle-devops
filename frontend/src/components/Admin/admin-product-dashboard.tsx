import { Grid, Box, Typography, TextField, Button, Stack, Link, Snackbar } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import ProductCard from "../product/product-card";
import { useCurrentUserDetails, useProducts } from "../../common/hooks";
import { Product, User } from "../../models/models";
import ProductInformation from "../product/dashboard";
import { useParams } from "react-router-dom";
import { Controller } from "react-hook-form";


const AdminProductInformation = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product| null>(null);
    const [editedProduct, setEditedProduct] = useState<Product| null>(null);
    const { token } = useCurrentUserDetails()
    const [successMessage, setSuccessMessage] = useState("");

    const fetchProduct = async (): Promise<void> => {
        try {

            const response = await fetch(
                `http://localhost:3005/product/${id}`,
            );

            if (!response.ok) {
                throw new Error("Error fetching Product information.");
            }

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error(error);
        }
    };



    const updateProduct = async (): Promise<void> => {
        try {
    
            const response = await fetch(
                `http://localhost:3005/admin/update-product-details/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editedProduct),
                }
            );
    
            if (!response.ok) {
                throw new Error("Error updating user information.");
            }
    
            const data = await response.json();
            setProduct(data);
            setSuccessMessage("Product updated successfully!");
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        setEditedProduct(product);
    }, [product]);

    if (!editedProduct) {
        return <div>Loading...</div>;
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof Product | keyof Product["address"],
        nestedKey?: "address"
    ) => {
        setEditedProduct((prevState) => {
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
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Grid container spacing={2} marginLeft={8} marginTop={2}>
            <Grid item xs={12}>
                <Typography variant="h4" noWrap sx={{ flexGrow: 1, fontFamily: "Didot" }}>Product details</Typography>
            </Grid>
            <Grid item xs={12} marginTop={30}>

                <TextField
                    id="outlined-read-only-input"
                    label="name"
                    value={editedProduct?.name}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'name')}
                />
            </Grid>
            {/* <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="price"
                    type="number"
                    InputProps={{
                      inputProps: { 
                        min: 0
                      }
                    }}
                    value={editedProduct?.price}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'price')}
                />
            </Grid> */}
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="categoery"
                    value={editedProduct?.category}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'category')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="subCategory"
                    value={editedProduct?.subCategory}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'subCategory')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="Street Address"
                    value={editedProduct?.address?.street_address}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'street_address', 'address')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="City"
                    value={editedProduct?.address?.city}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'city', 'address')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="Province"
                    value={editedProduct?.address?.province}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'province', 'address')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="Country"
                    value={editedProduct?.address?.country}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'country', 'address')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="Postal code"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={editedProduct?.address?.postal_code}
                    onChange={(e) => handleInputChange(e, 'postal_code', 'address')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="colour"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={editedProduct?.colour}
                    onChange={(e) => handleInputChange(e, 'colour')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="condition"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={editedProduct?.condition}
                    onChange={(e) => handleInputChange(e, 'condition')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    label="size"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    value={editedProduct?.size}
                    onChange={(e) => handleInputChange(e, 'size')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-required"
                    InputLabelProps={{
                        shrink: true,
                      }}
                    label="brand"
                    value={editedProduct?.brand}
                    onChange={(e) => handleInputChange(e, 'brand')}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    id="outlined-multiline-flexible"
                    multiline
                    maxRows={4}
                    label=" description"
                    value={editedProduct?.description}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={(e) => handleInputChange(e, 'description')}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={updateProduct}>
                    Save Changes
                </Button>
            <Snackbar open={!!successMessage} message={successMessage} />
            </Grid>
  
        </Grid>
        </Box>
    );
};
export default AdminProductInformation;