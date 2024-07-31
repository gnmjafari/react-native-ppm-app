import React from "react";
import TabNavigators from "../navigators/TabNavigators";
import { useDispatch, useSelector } from "react-redux";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme/build";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { en } from "../lang/en";
import { fa } from "../lang/fa";
import { I18n } from "i18n-js";

const Index = () => {
  const { theme } = useMaterial3Theme();
  const { themeMood, lang } = useSelector((state) => state.app);

  const translations = {
    en: en,
    fa: fa,
  };

  const i18n = new I18n(translations);
  i18n.locale = lang;

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
