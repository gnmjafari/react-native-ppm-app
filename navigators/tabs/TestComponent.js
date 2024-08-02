import React  from "react";
import { Text } from "react-native-paper";
import { useSelector } from "react-redux";

const TestComponent = ({ i18n }) => {
  const { lang } = useSelector((state) => state.app);

  return (
    <Text
      style={{
        fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
        fontSize: 40,
      }}
    >
      {i18n.t("tasks")}
    </Text>
  );
};

export default TestComponent;
