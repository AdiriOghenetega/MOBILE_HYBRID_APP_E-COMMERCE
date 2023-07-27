import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import productSliceReducer from "./productSlice";
import locationSliceReducer from "./locationSlice"
import orderSliceReducer from "./orderSlice"
import guestSliceReducer from "./guestSlice"
import pushTokenSliceReducer from "./pushTokenSlice"



export const store = configureStore({
  reducer: {
    user : userSliceReducer,
    product :  productSliceReducer,
    location : locationSliceReducer,
    order: orderSliceReducer,
    guest: guestSliceReducer,
    pushToken: pushTokenSliceReducer
  }
})


