import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { allProducts, allUsers } from '../../common/hooks';
import AdminProductCard from './admin-product-card';
import AdminUserCard from './admin-user-card';

enum AdminTab {
  productsTab,
  usersTab,
  offersTab,
}

export default function AdminDashboard() {
  const [value, setValue] = useState(AdminTab.productsTab);
  const { products, isLoading: productLoading, error: productError } = allProducts();
  const { users, isLoading: userLoading, error: userError } = allUsers();

  console.log("the users are" + users)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Products" value={AdminTab.productsTab} />
        <Tab label="Users" value={AdminTab.usersTab} />
        {/* <Tab label="Offers" value={AdminTab.offersTab} /> */}
      </Tabs>
      <div style={{ padding: '20px' }}>
        {value === AdminTab.productsTab && (
          <div>
            {productLoading ? (
              <p>Loading products...</p>
            ) : productError ? (
              <p>Error loading products</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gridGap: '20px' }}>
                {products && products.map((product) => (
                  <AdminProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
        </div>


        <div style={{ padding: '20px' }}>
        {value === AdminTab.usersTab && (
          <div>
            {userLoading ? (
              <p>Loading users...</p>
            ) : userError ? (
              <p>Error loading users</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gridGap: '20px' }}>
                {users && users.map((user) => (
                  <AdminUserCard key={user._id} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
        </div>
    </Box>
  );
}
