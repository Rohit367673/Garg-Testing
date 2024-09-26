import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart, calculatePrice } from "../redux/CartSlice";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { motion } from "framer-motion";

function Collection() {
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);

  // Fetch products from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        setProductList(data); // Set product list from backend
      })
      .catch(() => toast.error("Error fetching products"));
  }, []); // Empty dependency array means this will run once when the component mounts

  // Add to cart and send product data to MongoDB via API
  const addToCartHandler = (product) => {
    dispatch(addToCart(product)); // Add individual product to cart
    dispatch(calculatePrice());

    fetch("http://localhost:3001/addCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,      
        name: product.name,
        price: product.price,
        imgsrc: product.imgsrc,
        quantity: product.quantity || 1,
      }),
    })
    
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          toast.success("Order added to Cart");
        } else {
          toast.error("Failed to add order to cart");
        }
      })
      .catch(() => toast.error("Error adding order"));
  };

  // Toggle favorite status for each individual product
  const toggleFavorite = (productId) => {
    const updatedProducts = productList.map((product) =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    );
    setProductList(updatedProducts);
  };

  // Individual product card
  const ProductCard = ({ name, id, price, imgsrc, isFavorite }) => (
    <motion.div
      className="productCard"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img src={imgsrc} alt={name} />
      <p>{name}</p>
      <h4>{price} Rs</h4>
      <div className="btnval h-12 bg-white">
        <button onClick={() => addToCartHandler({ id, name, price, imgsrc, quantity: 1 })}>
          <Link>Add</Link>
        </button>
      </div>
      <button className="favBtn" onClick={() => toggleFavorite(id)}>
        {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </button>
    </motion.div>
  );

  return (
    <div className="flex p-12 flex-wrap content-center -ml-4">
      {productList.map((product) => (
        <ProductCard
          key={product.id} // Ensure each card has a unique key
          imgsrc={product.imgsrc}
          name={product.name}
          price={product.price}
          id={product.id}       // Pass the unique id
          isFavorite={product.isFavorite} // Track if it's a favorite
        />
      ))}
    </div>
  );
}

export default Collection;
