import { createSlice } from "@reduxjs/toolkit";
import { toast } from "../utils/helpers";


const initialState = {
  productList: [],
  cartItem: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setDataProduct: (state, action) => {
      state.productList = [...action.payload];
    },
    setCartData: (state, action) => {
      if(action.payload.length){
        state.cartItem = [...action.payload];
      }else{
        state.cartItem = []
      }
    },
    addCartItem: (state, action) => {
      const check = state.cartItem.some((el) => el._id === action.payload._id);
      if (check) {
        toast("Already Item in Cart");
      } else {
        toast("Item added successfully");
        const total = action.payload.price*action.payload.qty;
        state.cartItem = [
          ...state.cartItem,
          { ...action.payload, total: total },
        ];
      }
      
    },
    deleteCartItem: (state, action) => {
      toast("One item deleted");
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      state.cartItem.splice(index, 1);
    },
    increaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      let qty = state.cartItem[index].qty;
      const qtyInc = ++qty;
      state.cartItem[index].qty = qtyInc;

      const price = state.cartItem[index].price;
      const total = price * qtyInc;

      state.cartItem[index].total = total;

      
    },
    decreaseQty: (state, action) => {
      const index = state.cartItem.findIndex((el) => el._id === action.payload);
      let qty = state.cartItem[index].qty;
      if (qty > 1) {
        const qtyDec = --qty;
        state.cartItem[index].qty = qtyDec;

        const price = state.cartItem[index].price;
        const total = price * qtyDec;

        state.cartItem[index].total = total;

      
      }
    },
  },
});

export const {
  setDataProduct,
  setCartData,
  addCartItem,
  deleteCartItem,
  increaseQty,
  decreaseQty,
} = productSlice.actions;

export default productSlice.reducer;
