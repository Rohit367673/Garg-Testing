import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../component/AuthContext";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [fetchProducts, user]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${productToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        }
      );
      
      toast.success("Product deleted successfully");
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
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
                      onClick={() => handleDeleteClick(product)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the product "{productToDelete?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Products;
