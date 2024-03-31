import { Card, CardActionArea, CardMedia, CardContent, Typography, Link, Chip, Button } from "@mui/material";
import { User } from "../../models/models";
import { useEffect, useState } from "react";
import { useCurrentUserDetails } from "../../common/hooks";

type UserCardProps = {
  user: User;
};

function AdminUserCard({ user }: UserCardProps) {
  const imageSrc =  "https://cdn-icons-png.flaticon.com/512/5231/5231019.png"
  const { token } = useCurrentUserDetails()

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:3005/admin/delete-user/${id}`, {
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
          <CardMedia component="img" sx={{ height: 140, objectFit: "contain" }} image={imageSrc} title={user.username} />
          <CardContent>
          <Typography variant="body1" color="text.primary" sx = {{fontWeight: 610}}>
                      {user.username}
                    </Typography>
                    <Button href={`/admin/update-user/${user._id}`} variant="contained" sx={{ my: 1, mx: 1.5 }}>
                        Update
                    </Button>
            <Button onClick={() => deleteProduct(user._id)} variant="contained" sx={{ my: 1, mx: 1.5 }}>
              Delete
            </Button>
          </CardContent>
        </CardActionArea>
    </Card>
  );
}

export default AdminUserCard;