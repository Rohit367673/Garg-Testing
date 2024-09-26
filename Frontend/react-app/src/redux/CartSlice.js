import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  subTotal: 0,
  shipping: 0,
  Total: 0,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const value = action.payload;
      const isItemExist = state.cartItems.find((i) => i.id === value.id);
      if (isItemExist) {
        state.cartItems.forEach((i) => {
          if (i.id === value.id) i.quantity += 1;
        });
      } else {
        state.cartItems.push(value);
      }
    },
    decrement: (state, action) => {
        const item=action.payload
      const value = state.cartItems.find((i) => i.id === item.id);
      if (value.quantity > 1) {
        state.cartItems.forEach((i) => {
          if (i.id === value.id) i.quantity -= 1;
        });
      }
    },
    deleteCart:(state,action)=>{
      state.cartItems=state.cartItems.filter((i)=>i.id !== action.payload)
    },
    calculatePrice:(state)=>{
        let sum=0
        state.cartItems.forEach((i)=>(sum+= i.price*i.quantity));
        state.subTotal=sum;
        state.shipping=state.subTotal > 100 ? 20 :0
        state.Total= state.subTotal+state.shipping
         
    
      },
      setCartItems:(state,action)=>{
        state.cartItems=action.payload
      },

      
  }
 
}
);
export const { addToCart, decrement ,deleteCart,calculatePrice,setCartItems} = cartSlice.actions;
export default cartSlice.reducer;
