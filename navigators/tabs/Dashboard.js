import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  IconButton,
  List,
  Menu,
  Switch,
} from "react-native-paper";
import { useTheme, Text } from "react-native-paper";
import {
  FontAwesome5,
  FontAwesome,
  AntDesign,
  Fontisto,
} from "@expo/vector-icons";
import CheckboxInput from "../../component/Inputs/CheckboxInput";
import moment from "moment-jalaali";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import DashboardChart from "../../component/DashboardChart";
import { useDispatch, useSelector } from "react-redux";
import { changeLang, changeThemeMood } from "../../store";
import AddTaskAndRoutine from "../../component/AddTaskAndRoutine";

const Dashboard = ({ i18n }) => {
  const dispatch = useDispatch();
  const { themeMood, lang, routines, plans } = useSelector(
    (state) => state.app
  );

  console.log("plans", plans);

  moment.locale(lang);
  if (lang == "fa") {
    moment.loadPersian({ dialect: "persian-modern" });
  }

  const [openAddModal, setOpenAddModal] = useState(false);
  const [routinesToday, setRoutinesToday] = useState([]);
  const [tasksToday, setTasksToday] = useState([]);
  const [chartData, setChartData] = useState(false);
  const [editData, setEditData] = useState();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  useEffect(() => {
    setRoutinesToday(
      _.filter(
        routines,
        (item) =>
          _.includes(
            item.repeating,
            moment(new Date()).locale("en").format("dddd")
          ) &&
          item.date == moment(new Date()).locale("en").format("YYYY-MM-DD") &&
          item
      )
    );

    setTasksToday(
      _.filter(
        plans,
        (item) =>
          item.date == moment(new Date()).locale("en").format("YYYY-MM-DD") &&
          item
      )
    );
  }, [plans, routines]);

  const theme = useTheme();
  const styles = StyleSheet.create({
    scrollView: {
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "start",
      backgroundColor: theme.colors.background,
      width: "100%",
      direction: "rtl",
    },
    modalStyle: {
      justifyContent: "flex-start",
      backgroundColor: theme.colors.surface,
      padding: 30,
      margin: 10,

      borderRadius: 15,
    },
  });

  const checked = async ({ type, id }) => {
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
    await AsyncStorage.setItem(type, JSON.stringify(newArray));
  };

  const deleteTaskAndRoutine = async ({ type, id }) => {
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
    const newArray = _.filter(existingArray, (item) => item.id != id && item);
    await AsyncStorage.setItem(type, JSON.stringify(newArray));
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setEditData();
    setOpenAddModal(false);
  };

  const editTaskAndRoutine = async ({ type, id }) => {
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
    const editArray = _.filter(existingArray, (item) => item.id == id && item);
    setEditData({ type: type, data: editArray[0] });
    handleOpenAddModal();
  };

  const createChartData = (task, routine) => {
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

    if (!_.isEmpty(task)) {
      const totalItems = task.length;
      const checkedItems = _.filter(task, { checked: true }).length;

      const percentage = checkedItems / totalItems;

      labels.push(i18n.t("tasks"));
      colors.push(theme.colors.primary);
      data.push(Number(percentage));
    } else {
      labels.push(i18n.t("tasks"));
      colors.push(theme.colors.primary);
      data.push(0);
    }

    return setChartData({ labels, colors, data });
  };

  useEffect(() => {
    createChartData(tasksToday, routinesToday);
  }, [tasksToday, routinesToday]);

  return (
    <ScrollView style={styles.scrollView}>
      <Appbar.Header
        style={{
          marginTop: 20,
          paddingLeft: 10,
          paddingRight: 5,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: lang == "fa" ? "row-reverse" : "row",
        }}
      >
        <View
          style={{
            flexDirection: lang == "fa" ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              height: 50,
              width: 50,
            }}
          >
            <Card.Cover
              style={{ height: 50, width: 50 }}
              resizeMode="stretch"
              source={require("../../assets/logo.jpeg")}
            />
          </Card>

          <Button
            style={{
              margin: 10,
              borderRadius: 10,
            }}
            mode="contained-tonal"
            contentStyle={{
              height: 50,
              flexDirection: lang == "fa" ? "row-reverse" : "row",
            }}
            icon={({ color, size }) => (
              <FontAwesome5 name="tasks" color={color} size={size} />
            )}
            onPress={handleOpenAddModal}
          >
            <Text
              style={{
                fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                fontSize: 15,
              }}
            >
              {i18n.t("add_task_and_routine")}
            </Text>
          </Button>
        </View>
        <View>
          <Menu
            contentStyle={{ width: 200 }}
            visible={visible}
            onDismiss={closeMenu}
            anchorPosition="bottom"
            statusBarHeight={20}
            anchor={
              <IconButton
                style={{
                  margin: 10,
                  borderRadius: 10,
                }}
                mode="contained-tonal"
                icon={({ color, size }) => (
                  <Fontisto name="more-v-a" color={color} size={size} />
                )}
                onPress={openMenu}
              />
            }
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
              >
                {i18n.t("light")}
              </Text>
              <Switch
                style={{ width: 50 }}
                value={themeMood == "dark"}
                onValueChange={() => dispatch(changeThemeMood())}
              />

              <Text
                style={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
              >
                {i18n.t("dark")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                margin: 0,
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
              >
                {i18n.t("fa")}
              </Text>
              <Switch
                style={{ width: 50 }}
                value={lang == "en"}
                onValueChange={() => dispatch(changeLang())}
              />
              <Text
                style={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
              >
                {i18n.t("en")}
              </Text>
            </View>
          </Menu>
        </View>
      </Appbar.Header>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
          }}
        >
          {moment().format(lang == "fa" ? "jYYYY" : "YYYY")}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
          }}
        >
          {moment().format(lang == "fa" ? "jMMMM" : "MMMM")}
        </Text>
        <Text
          style={{
            fontSize: 60,
            fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
            color: theme.colors.primary,
          }}
        >
          {moment().format(lang == "fa" ? "jD" : "D")}
        </Text>
      </View>

      {!routinesToday.length && (
        <Card
          style={{
            marginHorizontal: 10,
            marginTop: 20,
            direction: "rtl",
          }}
        >
          <Card.Title
            titleStyle={{
              fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
              fontSize: 15,
              textAlign: lang == "fa" ? "right" : "left",
            }}
            title={i18n.t("Dont_you_have_routine_for_today")}
            left={() =>
              lang == "en" && (
                <FontAwesome
                  name="tasks"
                  size={35}
                  color={theme.colors.primary}
                />
              )
            }
            rightStyle={{ paddingRight: lang == "fa" && 20 }}
            right={() =>
              lang == "fa" && (
                <FontAwesome
                  name="tasks"
                  size={35}
                  color={theme.colors.primary}
                />
              )
            }
          />
        </Card>
      )}

      {!tasksToday.length && (
        <Card style={{ marginHorizontal: 10, marginTop: 20 }}>
          <Card.Title
            titleStyle={{
              fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
              fontSize: 15,
              textAlign: lang == "fa" ? "right" : "left",
            }}
            title={i18n.t("Dont_you_have_plan_for_today")}
            left={() =>
              lang == "en" && (
                <FontAwesome5
                  name="tasks"
                  size={35}
                  color={theme.colors.primary}
                />
              )
            }
            rightStyle={{ paddingRight: lang == "fa" && 20 }}
            right={() =>
              lang == "fa" && (
                <FontAwesome5
                  name="tasks"
                  size={35}
                  color={theme.colors.primary}
                />
              )
            }
          />
        </Card>
      )}

      <View style={styles.container}>
        {openAddModal && (
          <AddTaskAndRoutine
            open={openAddModal}
            close={handleCloseAddModal}
            style={styles.modalStyle}
            editData={editData}
            setEditData={setEditData}
            i18n={i18n}
            lang={lang}
            themeMode={themeMood}
          />
        )}

        {chartData && (
          <DashboardChart lang={lang} theme={theme} data={chartData} />
        )}

        <List.Section style={{ width: "100%" }}>
          {routinesToday.length > 0 && (
            <Card style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <List.Accordion
                titleStyle={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
                title={i18n.t("routine")}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <FontAwesome name="tasks" size={size} color={color} />
                    )}
                  />
                )}
              >
                {_.map(routinesToday, (item, index) => {
                  return (
                    <List.Item
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon={({ size, color }) => (
                            <CheckboxInput
                              status={item.checked}
                              onPressCustom={() => {
                                checked({ type: "routines", id: item.id });
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
                                  deleteTaskAndRoutine({
                                    type: "routines",
                                    id: item.id,
                                  });
                                }}
                              />
                              <AntDesign
                                name="edit"
                                size={size}
                                color={color}
                                onPress={() => {
                                  editTaskAndRoutine({
                                    type: "routines",
                                    id: item.id,
                                  });
                                }}
                              />
                            </View>
                          )}
                        />
                      )}
                    />
                  );
                })}
              </List.Accordion>
            </Card>
          )}
          {tasksToday.length > 0 && (
            <Card style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <List.Accordion
                titleStyle={{
                  fontFamily: lang == "fa" ? "IRANSans" : "SpaceMono",
                }}
                title={i18n.t("tasks")}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <FontAwesome5 name="tasks" size={size} color={color} />
                    )}
                  />
                )}
              >
                {_.map(tasksToday, (item, index) => {
                  return (
                    <List.Item
                      left={(props) => (
                        <List.Icon
                          {...props}
                          icon={({ size, color }) => (
                            <CheckboxInput
                              status={item.checked}
                              onPressCustom={() => {
                                checked({ type: "tasks", id: item.id });
                              }}
                            />
                          )}
                        />
                      )}
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
                                  deleteTaskAndRoutine({
                                    type: "tasks",
                                    id: item.id,
                                  });
                                }}
                              />
                              <AntDesign
                                name="edit"
                                size={size}
                                color={color}
                                onPress={() => {
                                  editTaskAndRoutine({
                                    type: "tasks",
                                    id: item.id,
                                  });
                                }}
                              />
                            </View>
                          )}
                        />
                      )}
                      key={index}
                      title={item.title}
                    />
                  );
                })}
              </List.Accordion>
            </Card>
          )}
        </List.Section>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
