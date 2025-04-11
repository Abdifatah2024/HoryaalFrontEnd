import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./Auth/LoginSlice";
import registerSlice from "./Auth/RegisterSlice";
import studentSlice from "./Auth/RegstdSlice";
import passwordSlice from "./passwordSlice";
import photoSlice from "./PhotouploadSlice";
import classSlice from "./Auth/classSlice";
import studentReducer from "./Auth/GetOneStudentsSlice";
import attendanceReducer from "./Auth/AttedenceSlice";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice,
    StdRegSlice: studentSlice,
    passwordSlice: passwordSlice,
    photoSlice: photoSlice,
    classSlice: classSlice,
    studentReducer: studentReducer,
    attendance: attendanceReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
