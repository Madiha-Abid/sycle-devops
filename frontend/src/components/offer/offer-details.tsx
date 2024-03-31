import { Box, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Tab, Tabs, Typography } from "@mui/material";
import OfferCard from "./offer-card";
import { useCurrentUserDetails, useCurrentUserOffers, useProducts } from "../../common/hooks";
import { off } from "process";
import { useEffect, useState } from "react";
import { Product } from "../../models/models";

interface Props {
    onSentTabSelected: () => void;
    onReceivedTabSelected: () => void;
}

enum OfferTab {
    Sent, Received
}


function OfferDetails() {
    const [currentTab, setCurrentTab] = useState(OfferTab.Sent);
    const { offers, isLoading: offersLoading, refresh, isValidating: offersUpdating } = useCurrentUserOffers(currentTab === OfferTab.Received)
    const { user, token, isLoading: userLoading } = useCurrentUserDetails()
    const [offerDialogOpen, setOfferDialogOpen] = useState(false);

    // console.log('product ids are', productIds)
    // console.log('products are', products)

    const [productIds, setProductIds] = useState<string[] | undefined>([]);
    const { products, isLoading: productLoading, error } = useProducts(productIds);

    const [productsMap, setProductsMap] = useState<{ [key: string]: Product }>({})

    useEffect(() => {
        const map = products?.reduce((acc: { [key: string]: Product }, product) => {
            acc[product._id] = product
            return acc
        }, {}) ?? {}
        setProductsMap(map)
    }, [products])

    //First make the array values unique which return a set {keys}. Next, convert it back to an array using spread operator
    useEffect(() => {
        if (offers) {
            const productIds = new Set(offers?.map((offer) => offer.productId));
            setProductIds([...productIds]);
        }
    }, [currentTab, offers])

    const handleChange = (event: React.SyntheticEvent, newValue: OfferTab) => {
        console.log('new value', newValue);
        setCurrentTab(newValue);
    };

    const loading = (
        <Box sx={{ display: 'flex', width: '100%', height: '512px', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    )

    return (
        <>
            <Container fixed sx={{ pt: 0 }}>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 50, mb: 2 }}
                >                <Tabs value={currentTab} onChange={handleChange} centered >
                        <Tab label="Offers Sent" value={OfferTab.Sent} />
                        <Tab label="Offers Received" value={OfferTab.Received} />
                    </Tabs>
                </Box>
                {
                    offersLoading ?
                        loading :
                        <>
                            <Grid container spacing={5} alignItems="center">
                                {offers?.map((offer) => {
                                    const matchingProduct = productsMap[offer.productId]

                                    if (matchingProduct) {
                                        return (
                                            <Grid item
                                                key={offer._id}
                                                xs={12}
                                                // sm={tier.title === 'Enterprise' ? 12 : 6}
                                                md={2.4}>
                                                <OfferCard offer={offer} product={matchingProduct}
                                                    refreshOffers={refresh} />
                                            </Grid>

                                        );
                                    }

                                    return null;
                                })}
                            </Grid>
                        </>

                }
            </Container>
        </>
    )
}

export default OfferDetails