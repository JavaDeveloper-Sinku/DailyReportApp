"use client";

import React, { useState, useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { listAllReports, deleteReport } from "../utils/fileHelper";
import { Edit2, Trash2 } from "lucide-react-native";

const { width } = Dimensions.get("window");

type ReportItem = {
  fileName: string;
  date: string;
  total?: number;
  products: any[];
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"Weekly" | "Monthly">("Weekly");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const allReports = await listAllReports();
      setReports(allReports);
    } catch (err) {
      console.log("Error loading:", err);
    }
  };

  const calculateTotal = (report: ReportItem) => {
    if (report.total) return report.total;
    return report.products?.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0) || 0;
  };

  const filterReportsByRange = () => {
    const now = new Date();
    return reports.filter((r) => {
      const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
      if (activeRange === "Weekly") return diff <= 7;
      if (activeRange === "Monthly") return diff <= 30;
      return true;
    });
  };

  const totalProduction = filterReportsByRange().reduce((sum, r) => sum + calculateTotal(r), 0);

  const handleDelete = (fileName: string) => {
    Alert.alert("Delete Report", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteReport(fileName);
          if (success) loadReports();
        },
      },
    ]);
  };

  const filteredReports = reports
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Buttons */}
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

      {/* Analysis Card */}
      <View style={styles.analysisCard}>
        <Text style={styles.analysisHeading}>Production Analysis</Text>
        <View style={styles.rangeRow}>
          {(["Weekly", "Monthly"] as const).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setActiveRange(r)}
              style={[styles.rangeTab, activeRange === r && styles.rangeTabActive]}
            >
              <Text style={[styles.rangeText, activeRange === r && styles.rangeTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.totalProduction}>{totalProduction} kit</Text>
      </View>

      {/* Recent Reports */}
      <View style={styles.recentBox}>
        <Text style={styles.recentTitle}>Recent Reports</Text>
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.fileName}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                <Text style={styles.reportDate}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.reportQty}>{calculateTotal(item)} kit</Text>
              </TouchableOpacity>

              {/* Edit Icon */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                <Edit2 size={22} color="#1abc9c" />
              </TouchableOpacity>

              {/* Delete Icon */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(item.fileName)}
              >
                <Trash2 size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatBtn}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.floatBtnPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 20, paddingTop: Platform.OS === "android" ? 20 : 0 },

  mainButton: {
    backgroundColor: "#10b981",
    padding: 16,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 10,
  },
  mainButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  secondaryButton: {
    padding: 16,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },
  secondaryButtonText: { color: "#333", fontWeight: "600", fontSize: 15 },

  analysisCard: {
    backgroundColor: "#10b981",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  analysisHeading: { fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 12 },
  rangeRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  rangeTab: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: "#fff" },
  rangeTabActive: { backgroundColor: "#fff" },
  rangeText: { color: "#fff", fontWeight: "700" },
  rangeTextActive: { color: "#10b981" },
  totalProduction: { fontSize: 28, fontWeight: "900", color: "#fff" },

  recentBox: { flex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 12 },
  recentTitle: { fontWeight: "700", fontSize: 18, marginBottom: 10 },

  reportCard: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  reportDate: { fontSize: 14, color: "#666" },
  reportQty: { fontSize: 16, fontWeight: "700", marginTop: 4 },

  iconBtn: { padding: 8, marginLeft: 8 },

  floatBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#2BAE8A",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatBtnPlus: { fontSize: 32, color: "#fff" },
});
