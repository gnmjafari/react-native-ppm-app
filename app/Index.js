import React from "react";
import TabNavigators from "../navigators/TabNavigators";
import { useSelector } from "react-redux";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme/build";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { I18n } from "i18n-js";

const Index = () => {
  const { theme } = useMaterial3Theme();
  const lang = useSelector((state) => state.app.lang);

  const themeMood = useSelector((state) => state.app.themeMood);
  console.log("langIndex", lang);

  const translations = {
    en: require("../lang/en.json"),
    fa: require("../lang/fa.json"),
  };

  const i18n = new I18n(translations);

  i18n.locale = lang;
  i18n.enableFallback = true;

  const paperTheme =
    themeMood === "dark"
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  return (
    <PaperProvider theme={paperTheme}>
      <TabNavigators i18n={i18n} />
    </PaperProvider>
  );
};

export default Index;
