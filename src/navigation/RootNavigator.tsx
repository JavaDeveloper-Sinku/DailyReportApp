import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import ReportListScreen from "../screens/ReportListScreen";
import ReportEditScreen from "../screens/ReportEditScreen";
import UserForm from "../screens/UserForm";
import { View, Text, StyleSheet } from "react-native";

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
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle} >Daily Report</Text>
    </View>
  );
};
// ------------------------------------------------

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => <CustomHeader />, // ⭐ CLEAN + SAFE
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
    paddingTop: 40,
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
});
