import React from "react";
import { View } from "react-native";
import { Agenda } from "react-native-multipurpose-calendar";
import { Button, Checkbox, Text, useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import _ from "lodash";
import { changeChecked } from "../utils/Utils";
import { useDispatch, useSelector } from "react-redux";

const AgendaComponent = ({ i18n }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { lang, themeMood, routines, plans } = useSelector(
    (state) => state.app
  );

  const renderItemCustom = ({ item, index }) => {
    return (
      <View
        key={`renderItem_${index}`}
        style={{
          width: "100%",
          height: "auto",
          marginBottom: 10,
          backgroundColor: theme.colors.primary,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button style={{ borderRadius: 10 }} mode="elevated">
            <Text>{i18n.t(item.type)}</Text>
          </Button>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Checkbox
            color={theme.colors.onPrimary}
            uncheckedColor={theme.colors.errorContainer}
            status={item.checked ? "checked" : "unchecked"}
            onPress={() => {
              changeChecked({ type: item.type, id: item.id, dispatch });
            }}
          />
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontSize: 18,
              fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
            }}
          >
            {item.title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <Agenda
        lang={lang}
        themeMode={themeMood}
        events={_.concat(routines || [], plans || [])}
        fontFamily={lang == "fa" ? "IRANSans" : "SpaceMono"}
        renderItemCustom={renderItemCustom}
      />
    </SafeAreaProvider>
  );
};

export default AgendaComponent;
