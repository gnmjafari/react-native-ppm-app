import _ from "lodash";
import { checkedPlanOrRoutine, deletePlan, deleteRoutine } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const changeChecked = async ({ type, id, dispatch }) => {
  let existingArray = [];
  if (type == "plans") {
    const existingData = await AsyncStorage.getItem(type);
    if (existingData) {
      existingArray = JSON.parse(existingData);
    }
  } else {
    const existingData = await AsyncStorage.getItem(type);
    if (existingData) {
      existingArray = JSON.parse(existingData);
    }
  }
  const newArray = _.map(existingArray, (item) =>
    item.id == id ? { ...item, checked: !item.checked } : item
  );

  dispatch(checkedPlanOrRoutine({ type, data: newArray }));
  await AsyncStorage.setItem(type, JSON.stringify(newArray));
};

export const deleteTaskAndRoutine = async ({ type, id, dispatch }) => {
  let existingArray = [];
  if (type == "plans") {
    const existingData = await AsyncStorage.getItem(type);
    if (existingData) {
      existingArray = JSON.parse(existingData);
    }
    dispatch(deletePlan(id));
  } else if (type == "routines") {
    const existingData = await AsyncStorage.getItem(type);
    if (existingData) {
      existingArray = JSON.parse(existingData);
    }
    dispatch(deleteRoutine(id));
  }
  const newArray = _.filter(existingArray, (item) => item.id != id && item);
  await AsyncStorage.setItem(type, JSON.stringify(newArray));
};

export const createChartData = (plan, routine, i18n, theme, setChartData) => {
  let labels = [];
  let colors = [];
  let data = [];

  if (!_.isEmpty(routine)) {
    const totalItems = routine.length;
    const checkedItems = _.filter(routine, { checked: true }).length;

    const percentage = checkedItems / totalItems;

    labels.push(i18n.t("routines"));
    colors.push(theme.colors.tertiary);
    data.push(Number(percentage));
  } else {
    labels.push(i18n.t("routines"));
    colors.push(theme.colors.tertiary);
    data.push(0);
  }

  if (!_.isEmpty(plan)) {
    const totalItems = plan.length;
    const checkedItems = _.filter(plan, { checked: true }).length;

    const percentage = checkedItems / totalItems;

    labels.push(i18n.t("plans"));
    colors.push(theme.colors.primary);
    data.push(Number(percentage));
  } else {
    labels.push(i18n.t("plans"));
    colors.push(theme.colors.primary);
    data.push(0);
  }

  return setChartData({ labels, colors, data });
};
