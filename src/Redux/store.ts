import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Auth/LoginSlice";
import registerSlice from "./Auth/RegisterSlice";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
