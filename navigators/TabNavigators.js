import React, { useEffect, useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Dashboard from "./tabs/Dashboard";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import {
  changeLang,
  changeThemeMood,
  updatePlans,
  updateRoutines,
} from "../store";
import ShowCalendar from "./tabs/ShowCalendar";
import moment from "moment-jalaali";
import fa from "moment/src/locale/fa";
import Loading from "../component/Loading";

const TabNavigators = ({ i18n }) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.app.lang);
  const isLoadingLang = useSelector((state) => state.app.isLoadingLang);
  const [index, setIndex] = useState(0);

  const checkLang = React.useMemo(async () => {
    const existingTheme = await AsyncStorage.getItem("theme");
    const existingLang = await AsyncStorage.getItem("lang");

    dispatch(changeThemeMood(existingTheme || "dark"));
    dispatch(changeLang(existingLang || lang));

    if (lang == "fa") {
      moment.locale(lang, fa);
      moment.loadPersian({ dialect: "persian-modern" });
    } else {
      moment.locale(lang);
    }

    return true;
  }, [lang]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: () => Dashboard({ i18n }),
    ShowCalendar: () => ShowCalendar({ i18n }),
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
    getPlans();
  }, []);

  return !isLoadingLang && checkLang ? (
    <BottomNavigation
      navigationState={{
        index,
        routes: [
          // {
          //   key: "music",
          //   title: i18n.t("tasks"),
          //   focusedIcon: "heart",
          //   unfocusedIcon: "heart-outline",
          // },
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
          {
            key: "ShowCalendar",
            title: i18n.t("calendar"),
            focusedIcon: ({ color, size }) => (
              <AntDesign name="calendar" size={size} color={color} />
            ),
            unfocusedIcon: ({ color, size }) => (
              <AntDesign name="calendar" size={size} color={color} />
            ),
          },
        ],
      }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
      getLabelText={(prop) => {
        const title = prop.route.title;

        return (
          <Text
            style={{
              fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
            }}
          >
            {title}
          </Text>
        );
      }}
    />
  ) : (
    <Loading />
  );
};

export default TabNavigators;
