import { useState, ChangeEvent } from "react"
import { KeyedMutator } from "swr"
import { useCurrentUserDetails, useCurrentUserOffers, useReviews } from "../../common/hooks"
import { appConfig } from "../../config"
import { Offer, Product, Review } from "../../models/models"
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, CircularProgress, Typography, Rating } from "@mui/material"

type ReviewDialogProps = {
    // offer: Offer
    product: Product
    // review: Review
    refreshOffers?: KeyedMutator<Offer[]>,
    reviewDialogOpen: boolean,
    setReviewDialogOpen: (value: boolean) => void,
}

function ReviewDialog(props: ReviewDialogProps) {

    const { user, token, isLoading } = useCurrentUserDetails()
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
    const [review, setReview] = useState('')
    const { offers, isLoading: offersLoading, refresh, isValidating: offersUpdating } = useCurrentUserOffers()
    const [rating, setRating] = useState<number | null>(null);
    const {refreshReviews} = useReviews({buyerId: user?._id, productId: props.product._id})


    const [reviewLoading, setReviewLoading] = useState(false)

    const onClose = () => props.setReviewDialogOpen(false)

    const onEventChange = (event: ChangeEvent<HTMLInputElement>) => {
        setReview((event.target.value))
    }

    const onSubmit = async () => {
        //add loading state set true
        //seterror text state and then addit in component
        //
        setReviewLoading(true)
        const response = await fetch(`${appConfig.baseUrl}/customer/add-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                sellerId: props.product.sellerId,
                buyerId: user?._id,
                productId: props.product._id,
                reviews: review,
                rating: rating
                // offerStatus: currentOfferAttributes.offerStatus
            }),
        });

        const responseData = await response.json()

        if (!response.ok) {
            console.error('Failed to add review', responseData)
            setReviewLoading(false)
                        // throw new Error('Failed to create offer', responseData);
        }
        else {
            console.log('Review successfully made', responseData)
            setReviewLoading(false)
            //props.refreshOffers?.()
            refreshReviews()
            onClose()
        }

    }; return (

        <Dialog open={props.reviewDialogOpen} onClose={onClose}>
            <DialogTitle>Add a Review</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a review for the seller
                </DialogContentText>
                <Typography component="legend">Rating</Typography>
      <Rating
        name="simple-controlled"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Review"
                    type="string"
                    fullWidth
                    variant="standard"
                    onChange={onEventChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {reviewLoading ? <CircularProgress /> :
                    <Button onClick={onSubmit}>Review</Button>
                }
            </DialogActions>
        </Dialog>
    )
}

export default ReviewDialog