import React, { useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import ReportListScreen from "../screens/ReportListScreen";
import ReportEditScreen from "../screens/ReportEditScreen";
import UserForm from "../screens/UserForm";

export type RootStackParamList = {
  Home: undefined;
  Report: undefined;
  ReportList: undefined;
  UserForm: undefined;
  ReportEdit: { reportId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ---------------- CUSTOM HEADER ----------------
const CustomHeader = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const navigateTo = (screen: string) => {
    closeMenu();
    //@ts-ignore
    navigation.navigate(screen);
  };

  return (
    <>
      <View style={styles.headerContainer}>

        {/* LEFT NOTES ICON */}
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={() => navigateTo("Home")}
        >
          <Ionicons name="document-text-outline" size={30} color="black" />
        </TouchableOpacity>

        {/* TITLE */}
        <Text style={styles.headerTitle}>Daily Report</Text>

        {/* RIGHT MENU ICON */}
        <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* POPUP MENU */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} onPress={closeMenu}>
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => navigateTo("Home")}>
              <Text style={styles.menuItem}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo("Report")}>
              <Text style={styles.menuItem}>Add Report</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo("ReportList")}>
              <Text style={styles.menuItem}>View Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo("UserForm")}>
              <Text style={styles.menuItem}>User Form</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};
// ------------------------------------------------

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => <CustomHeader />,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="ReportList" component={ReportListScreen} />
        <Stack.Screen name="ReportEdit" component={ReportEditScreen} />
        <Stack.Screen name="UserForm" component={UserForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// -------- HEADER STYLES ----------
const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },

  leftIcon: {
    position: "absolute",
    left: 20,
    top: 60,
  },

  menuIcon: {
    position: "absolute",
    right: 20,
    top: 60,
  },

  // MENU STYLES
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuBox: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 80,
    marginRight: 15,
    elevation: 10,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 8,
    color: "#000",
  },
});
