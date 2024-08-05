import React from "react";
import { List } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { View } from "react-native";
import CheckboxInput from "./Inputs/CheckboxInput";

const ItemList = React.memo(({ item, index, onEdit, onDelete, onChecked }) => {
  return (
    <List.Item
      left={(props) => (
        <List.Icon
          {...props}
          icon={() => (
            <CheckboxInput
              status={item.checked}
              onPressCustom={() => {
                onChecked();
              }}
            />
          )}
        />
      )}
      key={index}
      title={item.title}
      right={(props) => (
        <List.Icon
          {...props}
          icon={({ size, color }) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <AntDesign
                name="delete"
                size={size}
                color={color}
                onPress={() => {
                  onDelete();
                }}
              />
              <AntDesign
                name="edit"
                size={size}
                color={color}
                onPress={() => {
                  onEdit();
                }}
              />
            </View>
          )}
        />
      )}
    />
  );
});

export default ItemList;
