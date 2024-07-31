import React, { useEffect, useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Dashboard from "./tabs/Dashboard";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { updatePlans, updateRoutines } from "../store";

const TabNavigators = ({ i18n }) => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => Dashboard({ i18n }),
  });

  const getPlans = async () => {
    const existingPlans = await AsyncStorage.getItem("plans");
    const existingRoutines = await AsyncStorage.getItem("routines");
    if (existingPlans) {
      const existingArrayPlans = JSON.parse(existingPlans);
      dispatch(updatePlans(existingArrayPlans));
    }
    if (existingRoutines) {
      const existingArrayRoutines = JSON.parse(existingRoutines);
      dispatch(updateRoutines(existingArrayRoutines));
    }
  };

  useEffect(() => {
    console.log("useEffect");
    getPlans();
  }, []);

  return (
    <BottomNavigation
      navigationState={{
        index,
        routes: [
          {
            key: "dashboard",
            title: i18n.t("dashboard"),
            focusedIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
            unfocusedIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          },
        ],
      }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default TabNavigators;
