import React, { useState, useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RecentReport = {
  id: string;
  date: string;
  qty: string;
};

const DailyReportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      const storedReports = await AsyncStorage.getItem("recentReports");
      if (storedReports) setRecentReports(JSON.parse(storedReports));
    };
    loadReports();
  }, []);

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

        {recentReports.length === 0 && (
          <Text style={{ color: "#555", fontStyle: "italic" }}>
            No reports yet.
          </Text>
        )}

        <FlatList
          data={recentReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.reportCard}
              onPress={() =>
                navigation.navigate("ReportEdit", { reportId: item.id })
              }
            >
              <View style={styles.reportHeader}>
                <Text style={styles.reportId}>{item.id}</Text>
                <Text style={styles.reportDate}>{item.date}</Text>
              </View>
              <Text style={styles.reportQty}>{item.qty}</Text>
            </TouchableOpacity>
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

  // Message-style Report Card
  reportCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reportId: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: 14,
  },
  reportDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  reportQty: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2BAE8A",
  },

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
