import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Input, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Product, cityList, coloursList, conditionList, provinceList, sizeList, subCategoryList } from "../../models/models";
import { AuthDataContext } from "../../App";
import { useCurrentUserDetails, useIsAdmin } from "../../common/hooks";
import { error } from "console";
import { useNavigate } from "react-router-dom";


type FormData = {
    name: string,
    sellerId: string,
    streetAddress: string,
    city: string,
    province: string,
    country: string,
    postalCode: string,
    description: string,
    category: string,
    subCategory: string,
    price: Number,
    condition: Number,
    size: string,
    brand: string,
    colour: string,
    image: File
}

const defaultSubCategory = "Shirt"

function ProductForm() {

    const { control, handleSubmit } = useForm<FormData>({
        defaultValues: {
            category: "Mens",
            subCategory: defaultSubCategory,
            size: "Small",
            price: 0,
            condition: 5,
        },
    });

    const [image, setImage] = useState<File>(); // added useState hook to manage image state
    const [showError, setShowError] = useState(false)    
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { user, token, isLoading: userLoading } = useCurrentUserDetails()
    const isAdmin =  useIsAdmin()

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { // added type for event argument
        const imageFile = event.target.files?.[0]; // use optional chaining to handle undefined target.files
        setImage(imageFile);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log(data);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("address", JSON.stringify({
            streetAddress: data.streetAddress,
            city: data.city,
            province: data.province,
            country: data.country,
            postalCode: data.postalCode
        }));
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("subCategory", data.subCategory);
        formData.append("price", data.price.toString()); // convert number to string before appending
        formData.append("condition", data.condition.toString()); // convert number to string before appending
        formData.append("size", data.size);
        formData.append("brand", data.brand);
        formData.append("colour", data.colour);
        formData.append("image", image as Blob); // use image state instead of data.image
        formData.append("sellerId", isAdmin ? data.sellerId : (user?._id ?? ''));


        console.log("form data", formData.get("sellerId"))
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}, ${pair[1]}`);
          }
        const res = await fetch(`http://localhost:3005/${isAdmin ? 'admin' : 'customer'}/add-new-product`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, // use formData instead of JSON.stringify
        })
            const responseData = await res.json()

            if(res.ok){
                setShowError(false)
                const productData = responseData as Product
                console.log("Product created successfully with Id", productData._id)
                setSuccessMessage("Product Added Successfully");
                navigate(`/products/${productData._id}`);
            }
            else{
                setShowError(true)
                console.error("An error occured while creating the product", responseData)
                setSuccessMessage("Failed to add Product");
            }
    };

    return (
        <Container>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ mt: 12 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Paper elevation={3} component={Stack} direction="column" spacing={1.5} justifyContent="center" sx={{ py: 4, px: 2, width: "400px" }}>
                        <Typography variant='h5' align='center'>Add Product</Typography>
                        {isAdmin && <Controller
                            name="sellerId"
                            control={control}
                            rules={{ required: "Please enter seller's id" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Seller Id" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />}
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "Please enter product name" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Name" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="streetAddress"
                            control={control}
                            defaultValue={user?.address?.street_address}
                            rules={{ required: "Please enter your street address" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Street Address" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />

                        <Controller
                            name="city"
                            control={control}
                            defaultValue={user?.address?.city}
                            render={({ field }) =>
                                <FormControl>
                                    <InputLabel id="city-label">City</InputLabel>
                                    <Select
                                        labelId="city-label"
                                        id="city-select"
                                        label="City"
                                        {...field}
                                    >
                                        {
                                            cityList.map(city => <MenuItem value={city}>{city}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            }
                        />
                        <Controller
                            name="province"
                            control={control}
                            defaultValue={user?.address?.province}
                            render={({ field }) =>
                                <FormControl>
                                    <InputLabel id="province-label">Province</InputLabel>
                                    <Select
                                        labelId="province-label"
                                        id="province-select"
                                        label="Province"
                                        {...field}
                                    >
                                        {
                                            provinceList.map(province => <MenuItem value={province}>{province}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            }
                        />
                        <Controller
                            name="country"
                            control={control}
                            defaultValue="Pakistan"
                            // rules={{ required: "Please enter your country" }}
                            render={({ field, fieldState: { error } }) => <TextField disabled id="outlined-basic" label="Country" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="postalCode"
                            control={control}
                            defaultValue={user?.address?.postal_code}
                            rules={{ required: "Please enter your postal code" }}
                            render={({ field, fieldState: { error } }) => <TextField id="outlined-basic" label="Postal Code" variant="outlined" {...field} error={!!error} helperText={error ? error.message : null} />}
                        />
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <TextField multiline id="outlined-basic" label="Description" variant="outlined" {...field} />}
                        />
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) =>
                                <FormControl>
                                    <FormLabel >Category</FormLabel>
                                    <RadioGroup
                                        row

                                        sx={{}}
                                        {...field}
                                    >
                                        <FormControlLabel value="Mens" control={<Radio />} label="Mens" />
                                        <FormControlLabel value="Women" control={<Radio />} label="Women" />
                                    </RadioGroup>
                                </FormControl>
                            }
                        />

                        <Controller
                            name="subCategory"
                            control={control}
                            render={({ field }) =>
                                <FormControl>
                                    <InputLabel id="sub-category-label">Sub Category</InputLabel>
                                    <Select
                                        labelId="sub-category-label"
                                        id="sub-category-select"
                                        label="Sub Category"
                                        {...field}
                                    >
                                        {
                                            subCategoryList.map(category => <MenuItem value={category}>{category}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            }
                        />

                        <Controller
                            name="size"
                            control={control}
                            render={({ field }) =>
                                <FormControl>
                                    <FormLabel >Size</FormLabel>
                                    <RadioGroup
                                        row
                                        sx={{}}
                                        {...field}
                                    >
                                        {
                                            sizeList.map(size => <FormControlLabel value={size} control={<Radio />} label={size} />)
                                        }

                                    </RadioGroup>
                                </FormControl>
                            }
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => <TextField type="number" id="outlined-basic" label="Price" variant="outlined" inputProps={{min:0}}{...field} />}
                        />

                        <Controller
                            name="condition"
                            control={control}
                            render={({ field }) =>
                                <FormControl>
                                    <InputLabel id="condition-label">Condition</InputLabel>
                                    <Select
                                        labelId="condition-label"
                                        id="condition-select"
                                        label="Condition"
                                        {...field}
                                    >
                                        {
                                            conditionList.map(condition => <MenuItem value={condition.value}>{condition.title}</MenuItem>)
                                        }

                                    </Select>
                                </FormControl>
                            }
                        />

                        <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => <TextField id="outlined-basic" label="Brand" variant="outlined" {...field} />}
                        />

                        <Controller
                            name="colour"
                            control={control}
                            render={({ field }) =>
                                <FormControl>
                                    <InputLabel id="colour-label">Colour</InputLabel>
                                    <Select
                                        labelId="colour-label"
                                        id="colour-select"
                                        label="Colour"
                                        {...field}
                                    >
                                        {
                                            coloursList.map(colour => <MenuItem value={colour}>{colour}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            }
                        />

                        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <label htmlFor="image">Upload Image</label>
                            <Input
                                id="file-upload"
                                type="file"
                                onChange={handleImageChange}
                                disableUnderline
                            />
                            <label
                                htmlFor="file-upload"
                            ></label>
                        </Box>

                        <Button variant='contained' disabled={user == undefined} type="submit" sx={{ width: '100%', alignSelf: 'center', mt: 4 }}>Submit</Button>
                        {showError && <Typography color= "error"> An error occured, please check product fields </Typography>}
                        <Snackbar open={!!successMessage} message={successMessage} />
                    </Paper>
                </form>
            </Stack>
        </Container>
    );
}

export default ProductForm;

