import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.data = { ...state, data: action.payload };
    },
    guest: (state) => {
      state.data = { ...state, data: null };
    },
  },
});

export const { setUser, guest } = userSlice.actions;
