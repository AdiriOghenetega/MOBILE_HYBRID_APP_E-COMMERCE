import { createSlice } from "@reduxjs/toolkit";
import { toast } from "../utils/helpers";



const initialState = {
  orderList:[],
  currentOrder:{}
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderData: (state, action) => {
        state.orderList = action.payload
    },
    setCurrentOrderData: (state, action) => {
        state.currentOrder = action.payload
    },
    
  },
});

export const {
  setOrderData,
  setCurrentOrderData
} = orderSlice.actions;

export default orderSlice.reducer;
