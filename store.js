import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { createSlice, combineSlices, configureStore } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    lang: "en",
    themeMood: "dark",
    plans: [],
    routines: [],
  },
  reducers: {
    changeLang: (state) => {
      const newLang = state.lang === "en" ? "fa" : "en";
      state.lang = newLang;
    },

    changeThemeMood: (state) => {
      const newThemeMood = state.themeMood === "dark" ? "light" : "dark";
      state.themeMood = newThemeMood;
    },

    updatePlans: (state, action) => {
      // console.log("action", action);

      state.plans = action;
    },

    updateRoutines: (state, action) => {
      // console.log("action", action);

      state.routines = action;
    },
  },
});

const reducer = combineSlices(appSlice);

export const store = configureStore({
  reducer,
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer()),
});

export const { changeLang, changeThemeMood, updatePlans, updateRoutines } =
  appSlice.actions;
