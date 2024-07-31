import React, { useState } from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Dashboard from "./tabs/Dashboard";

const MusicRoute = ({ i18n }) => (
  <Text style={{ fontFamily: "SpaceMono", fontSize: 40 }}>
    {i18n.t("tasks")}
  </Text>
);

const TabNavigators = ({ i18n }) => {
  const [index, setIndex] = useState(0);

  const renderScene = BottomNavigation.SceneMap({
    music: () => MusicRoute({ i18n }),
    dashboard: () => Dashboard({ i18n }),
  });

  return (
    <BottomNavigation
      navigationState={{
        index,
        routes: [
          {
            key: "music",
            title: i18n.t("tasks"),
            focusedIcon: "heart",
            unfocusedIcon: "heart-outline",
          },
          {
            key: "dashboard",
            title: i18n.t("dashboard"),
            focusedIcon: "heart",
            unfocusedIcon: "heart-outline",
          },
        ],
      }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default TabNavigators;
