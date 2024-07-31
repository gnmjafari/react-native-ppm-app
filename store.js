import devToolsEnhancer from "redux-devtools-expo-dev-plugin";
import { createSlice, combineSlices, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      console.log("action", action.payload);

      state.plans = action.payload;
    },

    updateRoutines: (state, action) => {
      // console.log("action", action);

      state.routines = action.payload;
    },

    addPlan: (state, action) => {
      const { payload } = action;
      console.log("payload", payload);

      const createId = state.plans ? Number(state.plans.length) + 1 : 1;
      const createData = {
        id: payload.data?.id || `${createId}_tasks`,
        title: payload.data.title,
        date: payload.data.date,
        description: payload.data.description,
        checked: false,
        type: "tasks",
      };

      const newPlans = [...state.plans, createData];

      console.log("newPlans", newPlans);

      state.plans.push(createData);

      // add to AsyncStorage
      // const setTOAsyncStorage = async () => {
      //   try {
      //     await AsyncStorage.setItem("plans", JSON.stringify(newPlans));
      //   } catch (error) {
      //     console.log("catch error : ", error);
      //   }
      // };

      // setTOAsyncStorage();

      if (payload.onSuccess != "undefined") {
        return payload.onSuccess();
      }
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

export const {
  changeLang,
  changeThemeMood,
  updatePlans,
  updateRoutines,
  addPlan,
} = appSlice.actions;
