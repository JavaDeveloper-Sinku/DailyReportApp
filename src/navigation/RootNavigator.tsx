import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ReportListScreen from '../screens/ReportListScreen';
import ReportEditScreen from '../screens/ReportEditScreen';

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Report: undefined;
  ReportList: undefined;
  ReportEdit: { reportId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



// ------------------ CUSTOM HEADER ------------------
const CustomHeader = () => {
  const navigation = useNavigation<any>(); // 🔥 hook to get navigation

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle} onPress={() => navigation.navigate("Home")} >Daily Report</Text>
    </View>
  );
};
// -----------------------------------------------------

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          header: () => <CustomHeader />,   // 🔥 Global Header Here
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="ReportList" component={ReportListScreen} />
        <Stack.Screen name="ReportEdit" component={ReportEditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --------- STYLES FOR CUSTOM HEADER ----------
const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
});
