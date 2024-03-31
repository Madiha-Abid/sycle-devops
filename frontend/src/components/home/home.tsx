import { useState, useEffect } from 'react';
import './home.css';
import { appConfig } from '../../config';
import useSWR, { Fetcher } from 'swr';
import fetcher from '../../common/utils';
import { Product } from '../../models/models';
// import { Buffer } from "buffer";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItem, ListItemText, SelectChangeEvent, TextField, Typography } from '@mui/material';
import ProductCard from '../product/product-card';
import FilterDialog, { ProductFilters, allItemsId } from './filter-dialog';
import { useCurrentUserDetails } from '../../common/hooks';

const productsFetcher: Fetcher<Product[], [string, ProductFilters]> = async ([url, filters]) => {
  const filtersWithoutAll = Object.entries(filters).reduce((acc: {[key: string]: string}, [key, val]) => {
    if(val !== allItemsId){
      acc[key] = val
    }
    return acc
  }, {})
  let queryUrl = url
  if(Object.keys(filtersWithoutAll).length){
    const params = new URLSearchParams(filtersWithoutAll)
    queryUrl = `${url}?${params}`
  }

  console.log("products query url", queryUrl)
  const res = await fetch(queryUrl)
  return res.json()
}

function Home() {
  // const [data, setData] = useState<any>([]);
  // const { data, error, isLoading } = useSWR<Product[]>(`${appConfig.baseUrl}/products`, fetcher)

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const [productFilters, setProductFilters] = useState<ProductFilters>({
    category: allItemsId,
    subCategory: allItemsId,
    size: allItemsId,
    colour: allItemsId,
    city: allItemsId
  });

  const { data, error, isLoading } = useSWR<Product[]>([`${appConfig.baseUrl}/products`, productFilters], productsFetcher)
  // const { data, error, isLoading } = useSWR<Product[]>(`${appConfig.baseUrl}/products`, fetcher)

  const handleFilterOpen = () => {
    setFilterDialogOpen(true);
  };

  useEffect(() => {
    console.log("Product filteres", productFilters)
    console.log("Products loading", isLoading),
    console.log("Products were", data)
  }, [isLoading])

  // const handleFilterClose = () => {
  //   setFilterDialogOpen(false);
  // };
  // if (error) return <div>failed to load</div>
  // if (isLoading) return <div>loading...</div>
  // console.log(data)

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await fetch(`${appConfig.baseUrl}/products`);
  //     const jsonData = await response.json();
  //     setData(jsonData);
  //     window.scroll(0,0)
  //   }

  //   fetchData();
  // }, []);

  


   

  const loading = (
    <Box sx={{ display: 'flex', width: '100%', height: '512px', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
  )

  //isLoading parameter renamed to userLoading
  // const {user, token,  isLoading: userLoading} = useCurrentUserDetails()
  // console.log(user, token);


  return (
    <>
       <div className='container'>
      <div>
        <img src='https://studentlife.lincoln.ac.uk/files/2022/04/fashion.jpeg' className='kenburns-top' style={{ width: '100%', height: '100%', objectFit: 'cover' }} ></img>
      </div>
      <div className='box'>
        <div><p className='tracking-in-expand'>SYCLE</p></div>
        <div><p className='text'>WHERE FASHION MEETS SUSTAINABLITY</p></div>
      </div>
      </div>
      <Container fixed sx={{ pt: 8 }}>
    <Button variant="outlined" onClick={handleFilterOpen} sx={{ mb: 2 }}>
      Filter
    </Button>
    {
      isLoading ? 
      loading
      :
      <>
        <Grid container spacing={5} alignItems="center">
          {
            data && data.length ?
            data?.map((product) => (
              <Grid
                item
                key={product._id}
                xs={12}
                md={2.4}
              >
                <ProductCard product={product} />

              </Grid>
            )) :
            <Grid item xs={12}>No products found</Grid>
        }
        </Grid>
      </>

    }
  </Container>
  <FilterDialog filterDialogOpen={filterDialogOpen} setFilterDialogOpen={setFilterDialogOpen} productFilters={productFilters} setProductFilters={setProductFilters}/>
  </>
  );
}



export default Home;
