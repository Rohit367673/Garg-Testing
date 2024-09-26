import {configureStore} from "@reduxjs/toolkit";
import   cartSlice   from "./CartSlice";
import   userSlice   from "./UserdataSlice";
const store=configureStore({
    reducer: { cart: cartSlice,
    } ,
    reducers: { user: userSlice,}
})
export default store