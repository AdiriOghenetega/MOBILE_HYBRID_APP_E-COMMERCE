import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 expoPushToken :"",
};

export const pushTokenSlice = createSlice({
  name: "pushToken",
  initialState,
  reducers: {
    pushTokenRedux: (state, action) => {
      state.expoPushToken = action.payload;
    },
  },
});

export const { pushTokenRedux } = pushTokenSlice.actions;

export default pushTokenSlice.reducer;
