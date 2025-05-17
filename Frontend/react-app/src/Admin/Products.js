import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack
} from "@mui/material";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  // 1) fetchProducts is now useCallback so it can be reused
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`
      );

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2) delete then re-fetch to keep UI in sync
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`
      );
      // either re-fetch:
      await fetchProducts();
      // OR update locally:
      // setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <h2>Admin Product List</h2>
        <Button variant="outlined" onClick={fetchProducts}>
          Reload
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  {Array.isArray(product.size)
                    ? product.size.join(", ")
                    : product.size}
                </TableCell>
                <TableCell>
                  {Array.isArray(product.color)
                    ? product.color.join(", ")
                    : product.color}
                </TableCell>
                {/* use quantity, not stock */}
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.Catagory}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Products;
