import { Stack, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Chip, SelectChangeEvent, CircularProgress, Box } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Offer, Product } from "../../models/models";
import { useCurrentUserDetails } from "../../common/hooks";
import { appConfig } from "../../config";
import useSWR, { KeyedMutator } from "swr";

type OfferDialogProps = {
    offerDialogOpen: boolean,
    setOfferDialogOpen: (value: boolean) => void,
    product: Product,
    refreshOffers?: KeyedMutator<Offer[]>,
}

function OfferDialog(props: OfferDialogProps) {

    const { user, token, isLoading } = useCurrentUserDetails()

    const [offerPrice, setOfferPrice] = useState(props.product.price)
    const [offerLoading, setLoading] = useState(false)

    const onClose = () => props.setOfferDialogOpen(false)

    const onEventChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOfferPrice(Number(event.target.value))
    }

    const onSubmit = async () => {
        //add loading state set true
        //seterror text state and then addit in component
        //
        setLoading(true)
        const response = await fetch(`${appConfig.baseUrl}/customer/add-offer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                sellerId: props.product.sellerId,
                buyerId: user?._id,
                productId: props.product._id,
                offerPrice: offerPrice,
                // offerStatus: currentOfferAttributes.offerStatus
            }),
        });

        const responseData = await response.json()

        if (!response.ok) {
            console.error('Failed to create offer', responseData)
            setLoading(false)
            // throw new Error('Failed to create offer', responseData);
        }
        else {
            console.log('Offer successfully made', responseData)
            setLoading(false)
            props.refreshOffers?.()
            onClose()
        }

    };

    // const loading = (
    //     <Box sx={{ display: 'flex', width: '100%', height: '512px', justifyContent: 'center', alignItems: 'center' }}>
    //         <CircularProgress />
    //     </Box>
    // )

    return (

        <Dialog open={props.offerDialogOpen} onClose={onClose}>
            <DialogTitle>Negotiate the price</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter an offer you would like to make
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Price"
                    value={offerPrice}
                    type="number"
                    fullWidth
                    variant="standard"
                    onChange={onEventChange}
                    inputProps={{min:0}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {offerLoading ? <CircularProgress /> :
                    <Button onClick={onSubmit}>Negotiate</Button>
                }
            </DialogActions>
        </Dialog>
    )
}

export default OfferDialog