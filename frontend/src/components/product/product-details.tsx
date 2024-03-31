import { useParams } from "react-router-dom";
import useSWR from "swr";
import { appConfig } from "../../config";
import { OfferStatus, Product, Review } from "../../models/models";
import fetcher from "../../common/utils";
import { useCurrentUserDetails, useCurrentUserOffers, useIsAdmin, useProductImage } from "../../common/hooks";
import { Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Rating, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OfferDialog from "./offer-dialog";

function ProductDetails() {
    let { productId } = useParams();
    const [offerDialogOpen, setOfferDialogOpen] = useState(false);
    const { offers, isLoading: offersLoading, refresh, isValidating: offersUpdating } = useCurrentUserOffers()
    // console.log(offers)
    const { data: product, isLoading } = useSWR<Product>(`${appConfig.baseUrl}/product/${productId}`, fetcher)
    const { data: rating} = useSWR<{averageRating: number}>(`${appConfig.baseUrl}/get-seller-rating?id=${product?.sellerId}`, fetcher)
    const { data: reviews } = useSWR<Review[]>(`${appConfig.baseUrl}/reviews`, fetcher)
    console.log('rating', rating?.averageRating)

    //const [offerStatus, setOfferStatus] = useState<OfferStatus | undefined>()
    const [allowNegotiate, setAllowNegotiate] = useState(false)
    const [statusText, setStatusText] = useState("")
    const { user, token, isLoading: userLoading } = useCurrentUserDetails()
    const isAdmin = useIsAdmin()

    // useEffect(() => {
    //     console.log(`uid: ${user?._id}, product seller id: ${product?.sellerId}`)
    //     if (user?._id === product?.sellerId) {
    //         setAllowNegotiate(false)
    //     }
    // }, [user, product])



    useEffect(() => {
        if(user && !isAdmin){
        if (user?._id === product?.sellerId) {
            setAllowNegotiate(false)
        } else {
            console.log('offers in product', offers)
            const offer = offers?.find((offer) => offer.productId === productId)
            //setOfferStatus(offer?.offerStatus)
            console.log(`latest offer status for ${productId}`, offer?.offerStatus)
            switch (offer?.offerStatus) {
                case OfferStatus.Pending: {
                    setStatusText("Pending")
                    setAllowNegotiate(false)
                    break
                }
                case OfferStatus.Approved: {
                    setStatusText("Approved")
                    setAllowNegotiate(false)
                    break
                }
                case OfferStatus.AcceptedByBuyer: {
                    setStatusText("Accepted by Buyer")
                    setAllowNegotiate(false)
                    break
                }
                case OfferStatus.CancelledByBuyer: {
                    setStatusText("Cancelled by Buyer")
                    setAllowNegotiate(true)
                    break
                }
                case OfferStatus.Denied: {
                    setStatusText("Denied")
                    setAllowNegotiate(true)
                    break
                }
                default: {
                    setStatusText("")
                    setAllowNegotiate(true)
                }
            }
        }
    }
    else{
        setAllowNegotiate(false)
    }
    }, [user, product, offers])

    const loading = (
        <Box sx={{ display: 'flex', width: '100%', height: '512px', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    )

    const imageSrc = useProductImage(product)
    // console.log(data)
    const dateObj = product?.updated_on ? new Date(product.updated_on) : undefined;

    return (
        <Container fixed sx={{ pt: 8 }}>
            <Grid container spacing={5} >
                {
                    isLoading ?
                        loading
                        :
                        <>
                            <Grid
                                item
                                key={productId}
                                xs={12}
                                md={6}
                            >
                                <Paper variant="outlined">
                                    <Box display="flex" justifyContent={"center"} width="100%">
                                        <img
                                            style={{ maxHeight: "512px" }}

                                            src={imageSrc} />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >
                                <Typography variant="h6" gutterBottom>
                                    <strong>{product?.name}</strong>
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Date Added:</strong> {dateObj?.toDateString()}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Category:</strong> {product?.category}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Sub Category:</strong> {product?.subCategory}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Brand:</strong> {product?.brand}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Colour:</strong> {product?.colour}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Size:</strong> {product?.size}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Condition:</strong> {product?.condition}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Price:</strong> {product?.price}PKR
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>City:</strong> {product?.address?.city}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Description:</strong> {product?.description}
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <div>
                                        {offersUpdating ? <CircularProgress /> : allowNegotiate && <Button variant="contained" onClick={() => {
                                            setOfferDialogOpen(true)
                                        }}>
                                            Negotiate
                                        </Button>}
                                        {product && <OfferDialog offerDialogOpen={offerDialogOpen}
                                            setOfferDialogOpen={setOfferDialogOpen} product={product} refreshOffers={refresh} />
                                        }
                                    </div>
                                    {statusText && <Chip label={statusText} variant="outlined" />}
                                </Stack>
                                {<Typography variant="body1" gutterBottom marginTop={1}>
                                    <strong>Seller Reviews</strong>
                                </Typography>
                                }
                                {
                                    <Typography variant="body1" gutterBottom marginTop={1}>
                                    <strong>Average Rating: </strong> {rating?.averageRating}
                                </Typography>
                                }


                                {reviews?.map((review, index) =>
                                    product?.sellerId === review.sellerId ? (
                                        <>
                                            <Stack direction="row" spacing={4}>
                                                <Typography variant="body1" gutterBottom key={review._id}>
                                                    <strong>{index}. Review: </strong> {review?.reviews}
                                                </Typography>
                                                <Rating placeholder = "right" name="read-only" value={review.rating} readOnly />
                                            </Stack>
                                        </>
                                    ) : null
                                )}
                                {/* <Typography variant="body1" gutterBottom>
                                    <strong>Seller Rating:</strong> {review?.rating}
                                </Typography> */}
                            </Grid>
                        </>
                }
            </Grid>

        </Container>

        //   <div>
        //     {`${productId}: ${data?.name}`}
        // <img src={imageSrc} />
        //   </div>
    )
}

//offer that has the same propduct id as the current product id and show offer states in chips
//this would be in useEffect
//dependency would be offers array
//curentProduct status state, it would set the state there for the first offer or lastoffer
//use switch case to print offerStatus if this then this etc
//offerStatus would either be undefined(default state) o
//
export default ProductDetails