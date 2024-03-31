import { Card, CardActionArea, CardMedia, CardContent, Typography, Link, Chip, Box, IconButton, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material"
import { useCurrentUserDetails, useCurrentUserOffers, useIsAdmin, useProductImage, useProducts, useReviews } from "../../common/hooks"
import { Offer, OfferStatus, Product } from "../../models/models"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { appConfig } from "../../config";
import { useEffect, useState } from "react";
import { off } from "process";
import { KeyedMutator } from "swr";
import OfferDialog from "../product/offer-dialog";
import ReviewDialog from "./review-dialog";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

type OfferCardProps = {
    offer: Offer
    product?: Product
    refreshOffers?: KeyedMutator<Offer[]>,
}

enum ActionType {
    Approve, Deny, Negotiate, Review
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

//send a boolean prop here to showNegotiate when denied
//if offer added after deny and deny date then don't show negotiate button
//only check those offers that have status denied and then show negotaite button. If another
//ofer for product added with staus pending
function OfferCard(props: OfferCardProps) {
    const [offerProduct, setOfferProduct] = useState<Product | undefined>(props.product)
    const { products: productsById } = useProducts(props.product ? [] : [props.offer.productId])
    const imageSrc = useProductImage(offerProduct)
    const { user, token, isLoading: userLoading } = useCurrentUserDetails()
    const [negotiateDialogOpen, setNegotiateDialogOpen] = useState(false)
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const { reviews, reviewsValidating } = useReviews(props.offer.offerStatus === OfferStatus.AcceptedByBuyer ? { buyerId: props.offer.buyerId, productId: props.offer.productId } : {})
    const isAdmin = useIsAdmin()
    const [open, setOpen] = React.useState(false);


    //const [showReviewButton, setShowReviewButton] = useState(false);
    const { offers, isLoading: offersLoading, refresh, isValidating: offersUpdating } = useCurrentUserOffers()


    //offer card either for seller or buyer. If isSeller = false -> buyer
    const isSeller = props.offer.sellerId === user?._id

    //if product by id 
    useEffect(() => {
        if (productsById && productsById.length) {
            setOfferProduct(productsById[0])
        }
    }, [productsById])

    const onActionClick = async (actionType: ActionType) => {

        switch (actionType) {
            case ActionType.Approve:
            case ActionType.Deny: {
                //use fetch api to make a put request to update offer's status
                //set offer's status in body based on approve or deny action
                //if current offer status is OfferStatus.Pending (seller's case):
                //  action is approve -> OfferStatus.Approved
                //  action is deny -> OfferStatus.Denied
                //if current offer status is OfferStatus.Approved (buyer's case):
                //  action is approve -> OfferStatus.AcceptedByBuyer
                //  action is deny -> OfferStatus.CancelledByBuyer
                //after fetch is success we MUST refresh offers
                setActionLoading(true)
                let newOfferStatus = ''
                if (isSeller) {
                    if (props.offer.offerStatus === OfferStatus.Pending) {
                        if (actionType === ActionType.Approve) {
                            newOfferStatus = OfferStatus.Approved
                            // setOfferStatus(OfferStatus.Approved)
                        }
                        else {
                            newOfferStatus = OfferStatus.Denied
                        }
                    }
                }
                else {
                    if (props.offer.offerStatus === OfferStatus.Approved) {
                        if (actionType === ActionType.Approve) {
                            newOfferStatus = OfferStatus.AcceptedByBuyer
                        }
                        else {
                            newOfferStatus = OfferStatus.CancelledByBuyer
                        }
                    }
                }

                console.log('offer status', props.offer.offerStatus)

                const response = await fetch(`${appConfig.baseUrl}/customer/update-offer/${props.offer._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({

                        // _id: props.offer._id,
                        // sellerId: props.offer.sellerId,
                        // buyerId: props.offer.buyerId,
                        // productId: props.offer.productId,
                        // offerPrice: props.offer.offerPrice,
                        offerStatus: newOfferStatus
                    }),
                });

                const responseData = await response.json()
                console.log('response data', responseData)
                if (!response.ok) {
                    console.error('Failed to update status', responseData)
                    // setLoading(false)
                    // throw new Error('Failed to create offer', responseData);
                }
                else {
                    console.log('Offer status successfully updated', responseData)
                    // setLoading(false)
                    props.refreshOffers?.()
                    // onClose()
                }
                setActionLoading(false)
                break
            }

            case ActionType.Negotiate: {
                setNegotiateDialogOpen(true)
                break
            }

            case ActionType.Review: {
                setReviewDialogOpen(true)
                break
            }
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let offerActions = <></>

    if (offerProduct && !isAdmin) {
        if (actionLoading) {
            offerActions = <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        }

        else {
            if (isSeller) {
                if (props.offer.offerStatus === OfferStatus.Pending) {
                    offerActions =
                        <Box display="flex" justifyContent="center">
                            <IconButton color="primary" onClick={() => onActionClick(ActionType.Approve)}>
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => onActionClick(ActionType.Deny)}>
                                <CancelIcon />
                            </IconButton>
                        </Box>
                }
            }
            else {
                if (props.offer.offerStatus === OfferStatus.Approved) {
                    offerActions = <><Box display="flex" justifyContent="center">
                        <IconButton color="primary" onClick={() => onActionClick(ActionType.Approve)}>
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => onActionClick(ActionType.Deny)}>
                            <CancelIcon />
                        </IconButton>
                    </Box>
                    </>

                }
                else if (props.offer.offerStatus === OfferStatus.Denied) {
                    //useOfferDetails hook and then check the status from those offer . if status = pemding, hide negotate button
                    // console.log(`About to find matching offers for current offer`, props.offer)
                    const anotherMatchingRecentOffer = offers?.find((offer) => {
                        // console.log(`${props.offer._id}: looking for matching offer: iterating on`, offer)
                        // console.log(`${props.offer._id}: looking for matching offer: date compare`, offer.updated_on, props.offer.updated_on, offer.updated_on > props.offer.updated_on)
                        return offer._id !== props.offer._id && offer.updated_on > props.offer.updated_on && offer.productId === props.offer.productId //&& (offer.offerStatus === OfferStatus.Pending || offer.offerStatus === OfferStatus.AcceptedByBuyer);
                    });

                    //console.log(`${props.offer._id} Recent matching offer for offer`, props.offer, anotherMatchingRecentOffer)

                    if (anotherMatchingRecentOffer) {
                        offerActions = <></>
                    }
                    else {
                        offerActions = <Box display="flex" justifyContent="center" marginTop={1} >
                            <Button color="primary" variant="contained" onClick={() => onActionClick(ActionType.Negotiate)} size="small">
                                Negotiate
                            </Button>
                            <OfferDialog offerDialogOpen={negotiateDialogOpen}
                                setOfferDialogOpen={setNegotiateDialogOpen} product={offerProduct} refreshOffers={props.refreshOffers} />
                        </Box>
                    }
                }

                else if (props.offer.offerStatus === OfferStatus.AcceptedByBuyer) {

                    if (reviews && reviews.length) {
                        offerActions = <div>Review complete</div>
                    } else {
                        if (!reviewsValidating) {
                            offerActions = <Box display="flex" justifyContent="center" marginTop={1} >
                                <Button color="primary" variant="contained" onClick={() => onActionClick(ActionType.Review)}>
                                    Review
                                </Button>
                                <ReviewDialog reviewDialogOpen={reviewDialogOpen}
                                    setReviewDialogOpen={setReviewDialogOpen} product={offerProduct} refreshOffers={props.refreshOffers} />
                                    <Button variant="outlined" onClick={handleClickOpen} sx={{marginLeft:1}}>
                                        View Address
                                    </Button>
                                    <Dialog
                                        open={open}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        onClose={handleClose}
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle>{"View Address"}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-slide-description">
                                                {props.product?.address.street_address}
                                                {props.product?.address.city}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose}>Close</Button>
                                        </DialogActions>
                                    </Dialog>
                            </Box>
                        } else {
                            offerActions = <></>
                        }

                    }

                }
            }
        }
    }

    let statusText = ''

    switch (props.offer.offerStatus) {
        case OfferStatus.Pending: {
            statusText = "Pending"
            break
        }
        case OfferStatus.Approved: {
            statusText = "Approved"
            break
        }
        case OfferStatus.AcceptedByBuyer: {
            statusText = "Accepted by Buyer"
            break
        }
        case OfferStatus.CancelledByBuyer: {
            statusText = "Cancelled by Buyer"
            break
        }
        case OfferStatus.Denied: {
            statusText = "Denied"
            break
        }
    }



    return (
        <Card variant='outlined' sx={{ height: 338, width: '100%' }}>
            <Box display="flex" justifyContent="center" margin={2}>
                <Chip label={statusText} variant="outlined" />
            </Box>
            <CardMedia
                component={"img"}
                sx={{ height: 140, objectFit: "contain" }}
                image={imageSrc}
                title={offerProduct?.name}
            />
            <CardContent>
                <Typography variant="body1" color="text.primary" sx={{ fontWeight: 610 }}>
                    {offerProduct?.name}
                </Typography>
                <Typography component="p" variant="body2" color="text.primary">
                    <strong>Original Price:</strong> ${offerProduct?.price}
                </Typography>
                <Typography component="p" variant="body2" color="text.primary">
                    <strong>Offer Price:</strong> ${props.offer.offerPrice}
                </Typography>
                {offerActions}
            </CardContent>
            {/* sx={{ width: '50%', alignSelf: 'center', mt: 4 }} */}
        </Card>
    )
}

export default OfferCard