import { Card, CardActionArea, CardMedia, CardContent, Typography, Link, Chip, Button } from "@mui/material";
import { Product } from "../../models/models";
import { useEffect, useState } from "react";
import { useCurrentUserDetails, useProductImage } from "../../common/hooks";

type ProductCardProps = {
  product: Product;
};

function AdminProductCard({ product }: ProductCardProps) {
  const imageSrc = useProductImage(product);
  const { token } = useCurrentUserDetails()

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3005/admin/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting product information.");
      }

      const data = await response.json();
      // Perform any additional actions or state updates after successful deletion
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card variant="outlined" sx={{ height: 285, width: '100%' }}>
        <CardActionArea>
          <CardMedia component="img" sx={{ height: 140, objectFit: "contain" }} image={imageSrc} title={product.name} />
          <CardContent>
          <Typography variant="body1" color="text.primary" sx = {{fontWeight: 610}}>
                      {product.name}
                    </Typography>
                    <Typography component="p" variant="body2" color="text.primary">
                      Status: {product.status}
                    </Typography>
                    <Button href={`/admin/update-product-details/${product._id}`} variant="contained" sx={{ my: 1, mx: 1.5 }}>
                        Update
                    </Button>
            <Button onClick={() => deleteProduct(product._id)} variant="contained" sx={{ my: 1, mx: 1.5 }}>
              Delete
            </Button>
          </CardContent>
        </CardActionArea>
    </Card>
  );
}

export default AdminProductCard;
