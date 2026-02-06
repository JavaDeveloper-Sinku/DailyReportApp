import React, { useState } from "react";
import { NavigationContainer, useNavigation, NavigationProp } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import {
  Menu,
  Notebook,
  Home,
  Plus,
  FileText,
  BarChart3,
  X
} from "lucide-react-native";

import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import ReportListScreen from "../screens/ReportListScreen";
import ReportEditScreen from "../screens/ReportEditScreen";
import AnalysisScreen from "../screens/AnalysisScreen";

export type RootStackParamList = {
  Home: undefined;
  Report: undefined;
  ReportList: undefined;
  Analysis: undefined;
  ReportEdit: { fileName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ---------------- CUSTOM HEADER ----------------
const CustomHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  const navigateTo = (screen: keyof RootStackParamList) => {
    closeMenu();
    navigation.navigate(screen as any); // Type assertion for simple navigation
  };

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: insets.top + (Platform.OS === 'android' ? 10 : 0) }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* -------- LEFT LOGO/ICON ---------- */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigateTo("Home")}
          activeOpacity={0.7}
        >
          <View style={styles.logoContainer}>
            <Notebook size={22} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daily Report</Text>

        {/* -------- RIGHT MENU ICON ---------- */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
        >
          <Menu size={28} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* POPUP MENU */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuBox, { marginTop: insets.top + 60 }]}>

                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Navigation</Text>
                  <TouchableOpacity onPress={closeMenu}>
                    <X size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Home")}>
                  <Home size={20} color="#4B5563" />
                  <Text style={styles.menuItemText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Report")}>
                  <Plus size={20} color="#4B5563" />
                  <Text style={styles.menuItemText}>New Report</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("ReportList")}>
                  <FileText size={20} color="#4B5563" />
                  <Text style={styles.menuItemText}>View Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Analysis")}>
                  <BarChart3 size={20} color="#4B5563" />
                  <Text style={styles.menuItemText}>Analysis</Text>
                </TouchableOpacity>



              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: () => <CustomHeader />,
          contentStyle: { backgroundColor: '#F3F4F6' }, // Default bg color
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="ReportList" component={ReportListScreen} />
        <Stack.Screen name="ReportEdit" component={ReportEditScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 100,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    padding: 4,
  },

  // MENU STYLES
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "flex-end", // Align menu to right
    justifyContent: "flex-start",
  },
  menuBox: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 4,
    paddingTop: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
});
