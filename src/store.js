import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./reducers/projectReducer";
import sessionReducer from "./reducers/sessionReducer";

const store = configureStore({
  reducer: {
    projects: projectReducer,
    session: sessionReducer
  }
})

export default store
