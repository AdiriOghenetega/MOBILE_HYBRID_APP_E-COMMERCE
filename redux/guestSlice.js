import { createSlice } from "@reduxjs/toolkit";

const initialState = {
firstName: "",
lastName: "",
email: "",
mobile: "",
address:""
};

export const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    addGuestRedux: (state, action) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.mobile = action.payload.mobile;
      state.address=action.payload.address
    }
  },
});

export const { addGuestRedux} = guestSlice.actions;

export default guestSlice.reducer;
