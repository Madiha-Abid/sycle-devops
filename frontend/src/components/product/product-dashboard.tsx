import { Grid, Box, Typography, TextField, Button, Stack, Link, Snackbar, MenuItem, FormControlLabel, Radio } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import ProductCard from "./product-card";
import { useCurrentUserDetails, useProducts } from "../../common/hooks";
import { Product, User, conditionList, sizeList } from "../../models/models";
import ProductInformation from "./dashboard";
import { useNavigate, useParams } from "react-router-dom";


const IProductInformation = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [editedProduct, setEditedProduct] = useState<Product | null>(null);
    const { token } = useCurrentUserDetails()
    const [successMessage, setSuccessMessage] = useState("");
    const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
    const navigate = useNavigate();

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
                `http://localhost:3005/customer/update-product-details/${id}`,
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
            setSuccessMessage("Successfully Updated");
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProduct = async (): Promise<void> => {
        try {

            const response = await fetch(
                `http://localhost:3005/customer/delete-product/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error deleteing product information.");
            }

            const data = await response.json();
            setProduct(data);
            setSuccessDeleteMessage("successfully deleted");
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
        <Grid container spacing={2} marginTop={2} paddingLeft={40} alignContent="center">

            <Grid item xs={12} alignItems={"center"} >
                <Typography variant="h4" noWrap sx={{ flexGrow: 1, fontFamily: "Didot" }} paddingRight={43} alignSelf={"center"} textAlign={"center"}>
                    Product details
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
                <TextField
                    required
                    id="outlined-required"
                    label="price"
                    inputProps={{ min: 0 }}
                    value={editedProduct?.price}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => handleInputChange(e, 'price')}
                />
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6} width={200}>
                <TextField
                    required
                    id="outlined-required"
                    select
                    label="condition"
                    value={editedProduct?.condition}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => handleInputChange(e, 'condition')}
                >
                    {
                        conditionList.map(condition => <MenuItem value={condition.value}>{condition.title}</MenuItem>)
                    }
                </TextField>
            </Grid>
            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}
            <Grid item xs={12} md={6} width={200}>
                <TextField
                    required
                    id="outlined-required"
                    select
                    label="size"
                    value={editedProduct?.size}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => handleInputChange(e, 'size')}
                >
                    {
                        sizeList.map(size => <MenuItem value={size}>{size}</MenuItem>)
                    }
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
                <Button variant="contained" onClick={updateProduct} size="large">
                    Save Changes
                </Button>
                <Snackbar open={!!successMessage} message={successMessage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <Button variant="contained" onClick={deleteProduct} size="large">
                    Delete Product
                </Button>
                <Snackbar open={!!successDeleteMessage} message={successDeleteMessage} />
            </Grid>

        </Grid>
    );

};
export default IProductInformation;