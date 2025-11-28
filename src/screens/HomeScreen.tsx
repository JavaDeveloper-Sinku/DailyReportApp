import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

// Sample recent reports
const sampleRecentReports = [
  { id: "RPT-1001", date: "2025-11-28", qty: "500kit" },
  { id: "RPT-1002", date: "2025-11-27", qty: "300kit" },
  { id: "RPT-1003", date: "2025-11-26", qty: "600kit" },
];

const DailyReportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<"new" | "old">("new");

  return (
    <SafeAreaView style={styles.container}>
      {/* ---------------- MAIN BUTTONS ---------------- */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.mainButtonText}>NEW_REPORT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("ReportList")}
      >
        <Text style={styles.secondaryButtonText}>Report_List</Text>
      </TouchableOpacity>

      {/* ---------------- RECENT REPORTS BOX ---------------- */}
      <View style={styles.recentBox}>
        <Text style={styles.recentTitle}>Recent Reports</Text>

        <FlatList
          data={sampleRecentReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reportItem}>
              <Text style={styles.reportId}>{item.id}</Text>
              <Text style={styles.reportDate}>{item.date}</Text>
              <Text style={styles.reportQty}>{item.qty}</Text>
            </View>
          )}
        />
      </View>

      {/* ---------------- FLOATING BUTTON ---------------- */}
      <TouchableOpacity
        style={styles.floatBtn}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.floatBtnPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DailyReportScreen;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 0,
  },

  // Main Buttons
  mainButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#53BFA5",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 40,
  },

  mainButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },

  secondaryButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },

  // Recent Reports Box
  recentBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flex: 1,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#0f172a",
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  reportId: { fontWeight: "600", color: "#111" },
  reportDate: { color: "#555" },
  reportQty: { fontWeight: "700", color: "#2BAE8A" },

  // Floating Button
  floatBtn: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 60,
    height: 60,
    backgroundColor: "#2BAE8A",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  floatBtnPlus: {
    fontSize: 32,
    color: "#fff",
  },
});
