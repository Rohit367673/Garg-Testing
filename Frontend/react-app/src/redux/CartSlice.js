import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId: null, 
    cartItems: [],
    subTotal: 0,
    shipping: 0,
    Total: 0,
  },
  reducers: {
    
    initializeCart: (state) => {
      if (!state.cartId) {
        state.cartId = Date.now().toString(); 
      }
    },

    addToCart: (state, action) => {
     
      console.log("Adding item with payload:", action.payload);

 
      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );

      if (existingItemIndex !== -1) {

        state.cartItems[existingItemIndex].quantity += 1;
      } else {

        state.cartItems.push(action.payload);
      }
    },

    increment: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      const index = state.cartItems.findIndex(
        (item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (index !== -1) {
        state.cartItems[index].quantity += 1;
      }
    },

    decrement: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      const index = state.cartItems.findIndex(
        (item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (index !== -1 && state.cartItems[index].quantity > 1) {
        state.cartItems[index].quantity -= 1;
      }
    },

    deleteCart: (state, action) => {
      const { id, selectedSize, selectedColor } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor)
      );
    },

    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },

    calculatePrice: (state) => {
      const subTotal = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.subTotal = subTotal;
      state.Total = subTotal + state.shipping;
    },

    setCartId: (state, action) => {
      state.cartId = action.payload;
    },

   
    setShipping: (state, action) => {
      state.shipping = action.payload;
      
      state.Total = state.subTotal + state.shipping;
    },
  },
});

export const {
  addToCart,
  increment,
  decrement,
  deleteCart,
  setCartItems,
  calculatePrice,
  initializeCart,
  setCartId,
  setShipping, 
} = cartSlice.actions;
export default cartSlice.reducer;
