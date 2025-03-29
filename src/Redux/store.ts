import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Auth/LoginSlice";
import registerSlice from "./Auth/RegisterSlice";
import studentSlice from "./Auth/RegstdSlice";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice,
    StdRegSlice: studentSlice,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
