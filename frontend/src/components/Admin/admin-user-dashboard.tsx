import { Grid, Box, Typography, TextField, Button, Stack, Link, Card, CardContent, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import ProductCard from "../product/product-card";
import { useCurrentUserDetails, useProducts, useReviews, useUserDetailsWithId, useUserOffersById } from "../../common/hooks";
import { User } from "../../models/models";
import { useParams } from "react-router-dom";
import OfferCard from "../offer/offer-card";
import { alignProperty } from "@mui/material/styles/cssUtils";


const AdminUserInformation = () => {
    const { id } = useParams<{ id: string }>();
    const [editedUser, setEditedUser] = useState<User | undefined>(undefined);
    const [isUsernameDisabled] = useState<boolean>(true);
    const { user, refreshUser } = useUserDetailsWithId(id ?? '')
    const { token } = useCurrentUserDetails()
    const { products: productsListed } = useProducts(user?.listedProducts ?? []);
    const { products: productsPurchased } = useProducts(user?.purchasedProducts ?? []);
    const { offers: offersAsSeller } = useUserOffersById(id ?? '', true)
    const { offers: offersAsBuyer } = useUserOffersById(id ?? '', false)
    const { reviews: reviewsAsSeller } = useReviews({ sellerId: id })
    const { reviews: reviewsAsBuyer } = useReviews({ buyerId: id })


    const updateUser = async (): Promise<void> => {
        try {

            const response = await fetch(
                `http://localhost:3005/admin/update-user/${user?._id}`,
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

            // const data = await response.json();
            refreshUser()
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    if (!editedUser) {
        return <div>Loading...</div>;
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
            <Grid item xs={12}>
                <Typography variant="body1" noWrap sx={{ flexGrow: 1 }}><strong>Personal details</strong></Typography>
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
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Listed Products</strong> </Typography>
                {productsListed ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            productsListed.map((listedproduct) => (
                                <Grid
                                    item
                                    key={listedproduct._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <ProductCard product={listedproduct} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <p>User has no listed products.</p>
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

            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Offers Received</strong> </Typography>
                {offersAsSeller ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            offersAsSeller.map((offerReceived) => (
                                <Grid
                                    item
                                    key={offerReceived._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <OfferCard offer={offerReceived} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <p>User has not purchased any products.</p>
                )}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Offers Made</strong> </Typography>
                {offersAsBuyer ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            offersAsBuyer.map((offerMade) => (
                                <Grid
                                    item
                                    key={offerMade._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <OfferCard offer={offerMade} />
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <p>User has not purchased any products.</p>
                )}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Reviews Received</strong> </Typography>
                {reviewsAsSeller && reviewsAsSeller.length ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            reviewsAsSeller.map((review, index) => (
                                <Grid
                                    item
                                    key={review._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <Card variant='outlined' sx={{ height: 70, width: '100%', textAlign: 'center' }}>
                                        <CardContent>
                                            <>
                                                <Stack direction="row" spacing={4}>
                                                    <Typography variant="body1" gutterBottom key={review._id}>
                                                        <strong>{index + 1}. Review: </strong> {review?.reviews}
                                                    </Typography>
                                                    <Rating placeholder="right" name="read-only" value={review.rating} readOnly />
                                                </Stack>
                                            </>

                                        </CardContent>
                                    </Card>

                                </Grid>
                            ))
                        }
                    </Grid>


                ) : (
                    <p>User has not purchased any products.</p>
                )}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" > <strong>Reviews Made</strong> </Typography>
                {reviewsAsBuyer && reviewsAsBuyer.length ? (
                    <Grid container spacing={2} marginTop={0.5}>
                        {
                            reviewsAsBuyer.map((review, index) => (
                                <Grid
                                    item
                                    key={review._id}
                                    xs={12}
                                    md={2.4}
                                >
                                    <Card variant='outlined' sx={{ height: 150, width: '100%', textAlign: 'center'}}>
                                        <CardContent>
                                        <>
                                            <Stack direction="column" spacing={4}>
                                                <Typography variant="body1" gutterBottom key={review._id}>
                                                    <strong>{index + 1}. Review: </strong> {review?.reviews}
                                                </Typography>
                                                <Rating placeholder = "right" name="read-only" value={review.rating} readOnly />
                                            </Stack>
                                        </>

                                        </CardContent>
                                    </Card>

                                </Grid>
                            ))
                        }
                    </Grid>

                    
                ) : (
                    <p>User has not purchased any products.</p>
                )}
            </Grid>



        </Grid>
    );
};
export default AdminUserInformation;