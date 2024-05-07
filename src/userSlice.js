import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: false,
    data: null,
  },
  reducers: {
    user: (state, action) => {
      state.user = true;
      state.data = action.payload;
    },
    guest: (state) => {
      state.user = false;
      state.data = null;
    },
  },
});

export const { user, guest } = userSlice.actions;

export default userSlice.reducer;
