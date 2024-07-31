import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { ProgressChart } from "react-native-chart-kit";

const DashboardChart = ({ lang, data, theme }) => {
  return (
    <View
      style={{
        flexDirection: lang == "en" ? "row" : "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        width: "95%",
        marginTop: 20,
        backgroundColor: theme.colors.secondaryContainer,
        borderRadius: 15,
      }}
    >
      <ProgressChart
        hideLegend
        withCustomBarColorFromData
        data={data}
        width={200}
        height={200}
        strokeWidth={15}
        style={{ borderRadius: 15 }}
        chartConfig={{
          backgroundGradientFrom: theme.colors.secondaryContainer,
          backgroundGradientFromOpacity: 1,
          backgroundGradientTo: theme.colors.secondaryContainer,
          backgroundGradientToOpacity: 1,

          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
      <View style={{ marginTop: 10, gap: 30 }}>
        {data.labels.map((label, index) => (
          <View
            key={index}
            style={{
              flexDirection: lang == "en" ? "row" : "row-reverse",
              alignItems: "center",
              marginHorizontal: 10,
            }}
          >
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: data.colors[index],
                marginRight: 10,
                marginLeft: 10,
                borderRadius: 50,
                marginTop: 3,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
              }}
            >
              {label} : {data.data[index] * 100} %
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default DashboardChart;
