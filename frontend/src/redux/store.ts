import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./auth";

export const store = configureStore({
  reducer: { auth: reducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
