import React, { useState } from "react";
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
import { FontAwesome5, FontAwesome, Fontisto } from "@expo/vector-icons";
import moment from "moment-jalaali";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import DashboardChart from "../../component/DashboardChart";
import { useDispatch, useSelector } from "react-redux";
import { changeLang, changeThemeMood } from "../../store";
import AddTaskAndRoutine from "../../component/AddTaskAndRoutine";
import {
  changeChecked,
  createChartData,
  deleteTaskAndRoutine,
} from "../../utils/Utils";
import ItemList from "../../component/ItemList";

const useLocales = {
  fa: {
    monthNames: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    monthNamesShort: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    dayNames: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ],
    dayNamesShort: [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ],
  },
  en: {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],

    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    dayNames: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

const Dashboard = ({ i18n }) => {
  const dispatch = useDispatch();

  const { themeMood, lang } = useSelector((state) => state.app);
  const routines = useSelector((state) => state.app.routines);
  const plans = useSelector((state) => state.app.plans);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editData, setEditData] = useState();
  const [visible, setVisible] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState(false);
  const [expandedRoutines, setExpandedPlansRoutines] = useState(false);

  const handlePressPlans = () => setExpandedPlans(!expandedPlans);
  const handlePressRoutines = () => setExpandedPlansRoutines(!expandedRoutines);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

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
    if (type == "plans") {
      setEditData({
        type: type,
        data: {
          ...editArray[0],
          date:
            lang == "fa"
              ? moment(editArray[0].date).format("jYYYY-jMM-jDD")
              : editArray[0].date,
        },
      });
    } else if (type == "routines") {
      setEditData({
        type: type,
        data: {
          ...editArray[0],
          start_routine:
            lang == "fa"
              ? moment(editArray[0].start_routine).format("jYYYY-jMM-jDD")
              : editArray[0].start_routine,
          end_routine:
            lang == "fa"
              ? moment(editArray[0].end_routine).format("jYYYY-jMM-jDD")
              : editArray[0].end_routine,
        },
      });
    }
    handleOpenAddModal();
  };

  const routinesToday = React.useMemo(() => {
    const data = _.filter(routines, (item) => {
      return (
        _.includes(
          item.repeating,
          moment(new Date()).locale("en").format("dddd")
        ) &&
        item.date == moment(new Date()).locale("en").format("YYYY-MM-DD") &&
        item
      );
    });

    return data || [];
  }, [routines]);

  const tasksToday = React.useMemo(() => {
    const data = _.filter(plans, (item) => {
      return (
        item.date == moment(new Date()).locale("en").format("YYYY-MM-DD") &&
        item
      );
    });

    return data || [];
  }, [plans]);

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
                onValueChange={async () => {
                  dispatch(
                    changeThemeMood(themeMood == "dark" ? "light" : "dark")
                  );
                  await AsyncStorage.setItem(
                    "theme",
                    themeMood == "dark" ? "light" : "dark"
                  );
                }}
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
                onValueChange={async () => {
                  dispatch(changeLang(lang == "en" ? "fa" : "en"));

                  await AsyncStorage.setItem(
                    "lang",
                    lang == "en" ? "fa" : "en"
                  );
                }}
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
          {
            useLocales[lang].monthNames[
              moment().format(lang == "fa" ? "jM" : "M") - 1
            ]
          }
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

      {routinesToday.length <= 0 && (
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

      {tasksToday.length <= 0 && (
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

        <DashboardChart
          lang={lang}
          theme={theme}
          data={createChartData(tasksToday, routinesToday, i18n, theme)}
        />

        <List.Section style={{ width: "100%" }}>
          {routinesToday.length > 0 && (
            <Card style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <List.Accordion
                expanded={expandedRoutines}
                onPress={handlePressRoutines}
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
                  const onChecked = () =>
                    changeChecked({
                      type: "routines",
                      id: item.id,
                      dispatch,
                      date: item.date,
                    });
                  const onDelete = () =>
                    deleteTaskAndRoutine({
                      type: "routines",
                      id: item.id,
                      dispatch,
                    });
                  const onEdit = () =>
                    editTaskAndRoutine({
                      type: "routines",
                      id: item.id,
                    });
                  return (
                    <ItemList
                      key={item.id}
                      index={index}
                      item={item}
                      onEdit={() => onEdit()}
                      onDelete={() => onDelete()}
                      onChecked={() => onChecked()}
                    />
                  );
                })}
              </List.Accordion>
            </Card>
          )}
          {tasksToday.length > 0 && (
            <Card style={{ marginHorizontal: 10, marginVertical: 20 }}>
              <List.Accordion
                expanded={expandedPlans}
                onPress={handlePressPlans}
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
                  const onChecked = () =>
                    changeChecked({
                      type: "plans",
                      id: item.id,
                      dispatch,
                      date: item.date,
                    });
                  const onDelete = () =>
                    deleteTaskAndRoutine({
                      type: "plans",
                      id: item.id,
                      dispatch,
                    });
                  const onEdit = () =>
                    editTaskAndRoutine({
                      type: "plans",
                      id: item.id,
                    });
                  return (
                    <ItemList
                      key={item.id}
                      index={index}
                      item={item}
                      onEdit={() => onEdit()}
                      onDelete={() => onDelete()}
                      onChecked={() => onChecked()}
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
