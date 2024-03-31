import { Card, CardActionArea, CardMedia, CardContent, Typography, Link, Chip } from "@mui/material"
import { Product } from "../../models/models"
import { useEffect, useState } from "react"
import { useProductImage } from "../../common/hooks"

type ProductCardProps = {
    product: Product
}


function ProductCard({product}: ProductCardProps){

    const imageSrc = useProductImage(product)

    return (
        <Card variant='outlined' sx = {{height: 285, width: '100%'}}>
            <Link
              variant="button"
              color="text.primary"
              underline="none"
            //   href="/products/:productId"
              href = {`/products/${product._id}`}
              sx={{ my: 1, mx: 1.5 }}
            >
                <CardActionArea>
                  
                <CardMedia
                    component={"img"}
                    sx={{ height: 140, objectFit: "contain" }}
                    image = {imageSrc}
                    // image = {imageBase64 && `data:${product.image.img.contentType};base64,${imageBase64}`}
                    // image='https://s3-alpha-sig.figma.com/img/6183/e0fc/f2b06169d28c0cb1d2ac14bf97835119?Expires=1684713600&Signature=RFmsT-ASjwxDp6rY-0X97P4AoimM6pr0KAIIY9euSqEYA9A3juvSSkzH-h0W~j6d~Kif008Cm56RFIjDQahlcNoEn9vZxlGnJ5dLkWXRac-rButx6Sn~rvmD49Pk4zk0jOLe6xwDcdR67PBJxltjB5~qOMwVrqMsARA5z5OWqP-p-oHw8llEc5yHwf~P667Hx5dBFjgk3IxrhdsBqlm39QlOwhLyeIWHXTvnlfq-0fC49RQUyqDUffGGkzl2e8At15p4zB0zyS1EXhh2WwAWRVtBFhM032cG6sy9AGcqe-YCkDxK1EMxRbGieV7-rANTvBkxsHres~JBlfdsiqHIJQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4'
                    title={product.name}
      />
                <CardContent>
                <Typography variant="body1" color="text.primary" sx = {{fontWeight: 610}}>
                      {product.name}
                    </Typography>
                    <Typography component="p" variant="body2" color="text.primary">
                      {product.price}PKR
                    </Typography>
                <Typography
                        component="p"
                        variant="body2"
                        align="left"
                        key = {product._id}
                        sx = {{display: "-webkit-box",
                        boxOrient: "vertical",
                        lineClamp: 3,
                        wordBreak: "break-all",
                        overflow: "hidden",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical"}}
                      >
                        {product.description}
                      </Typography>
                </CardContent>
                {/* sx={{ width: '50%', alignSelf: 'center', mt: 4 }} */}
                </CardActionArea>
                </Link>
              </Card>
    )
}

export default ProductCard