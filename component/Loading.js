import * as React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

const Loading = ({ size = "large" }) => (
  <ActivityIndicator
    style={styles.loading}
    size={size}
    animating={true}
    color={MD2Colors.red800}
  />
);

export default Loading;

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "50%",
  },
});
