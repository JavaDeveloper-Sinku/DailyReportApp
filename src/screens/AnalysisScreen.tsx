"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { listAllReports } from "../utils/fileHelper";

const { width } = Dimensions.get("window");

type Product = {
  name: string;
  selectedSize: string;
  quantity: number;
};

type ReportItem = {
  date: string;
  total?: number;
  products: Product[];
};

const AnalysisScreen: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"Weekly" | "Monthly">("Weekly");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const allReports = await listAllReports();
    setReports(allReports);
  };

  const filterReports = () => {
    const now = new Date();
    return reports.filter((r) => {
      const diff = (now.getTime() - new Date(r.date).getTime()) / (1000 * 60 * 60 * 24);
      if (activeRange === "Weekly") return diff <= 7;
      if (activeRange === "Monthly") return diff <= 30;
      return true;
    });
  };

  const calculateTotal = (report: ReportItem) => {
    if (report.total) return report.total;
    return report.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;
  };

  const filteredReports = filterReports();
  const totalProduction = filteredReports.reduce((sum, r) => sum + calculateTotal(r), 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Production Analysis</Text>

      {/* Range selector */}
      <View style={styles.rangeRow}>
        {(["Weekly", "Monthly"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setActiveRange(r)}
            style={[styles.rangeTab, activeRange === r && styles.rangeTabActive]}
          >
            <Text style={[styles.rangeText, activeRange === r && styles.rangeTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total production */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Production ({activeRange})</Text>
        <Text style={styles.totalValue}>{totalProduction} kit</Text>
      </View>

      {/* Report list */}
      <FlatList
        data={filteredReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        keyExtractor={(item, index) => item.date + index}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <Text style={styles.reportDate}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.reportQty}>Total: {calculateTotal(item)} kit</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AnalysisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
    alignSelf: "center",
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  rangeTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#10b981",
    backgroundColor: "transparent",
  },
  rangeTabActive: { backgroundColor: "#10b981" },
  rangeText: { fontWeight: "700", color: "#10b981" },
  rangeTextActive: { color: "#fff" },

  totalCard: {
    backgroundColor: "#10b981",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  totalLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
  totalValue: { color: "#fff", fontSize: 28, fontWeight: "900", marginTop: 5 },

  reportCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  reportDate: { fontSize: 14, color: "#6b7280", fontWeight: "600" },
  reportQty: { fontSize: 16, color: "#111827", fontWeight: "700", marginTop: 6 },
});
