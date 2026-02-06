"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { listAllReports, deleteReport } from "../utils/fileHelper";
import { Edit2, Trash2, Plus, FileText, BarChart3, ChevronRight } from "lucide-react-native";

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

  const loadReports = async () => {
    try {
      const allReports = await listAllReports();
      setReports(allReports);
    } catch (err) {
      console.log("Error loading:", err);
    }
  };

  // Reload reports when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const calculateTotal = (report: ReportItem) => {
    if (report.total) return report.total;
    return report.products?.reduce((sum: number, p: any) => sum + (parseInt(p.quantity) || 0), 0) || 0;
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
    Alert.alert("Delete Report", "Are you sure you want to delete this report?", [
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

  const filteredReports = reports.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Welcome / Date Section */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingTitle}>Production Overview</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      {/* Analysis Card */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <View style={styles.statsIconBox}>
            <BarChart3 size={20} color="#fff" />
          </View>
          <Text style={styles.statsTitle}>Total Production</Text>
        </View>

        <Text style={styles.statsValue}>{totalProduction.toLocaleString()} <Text style={styles.statsUnit}>kits</Text></Text>

        <View style={styles.tabContainer}>
          {(["Weekly", "Monthly"] as const).map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setActiveRange(range)}
              style={[styles.tab, activeRange === range && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeRange === range && styles.tabTextActive]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#10B981" }]}
            onPress={() => navigation.navigate("Report")}
          >
            <Plus size={24} color="#fff" />
            <Text style={styles.actionButtonText}>New Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#3B82F6" }]}
            onPress={() => navigation.navigate("ReportList")}
          >
            <FileText size={24} color="#fff" />
            <Text style={styles.actionButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ReportList")}>
          <Text style={styles.viewAllLink}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.fileName}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reports found.</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Report")}>
              <Text style={styles.emptyAction}>Create your first report</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardMain}
              onPress={() => navigation.navigate("ReportEdit", { fileName: item.fileName })}
            >
              <View style={styles.cardIconBox}>
                <FileText size={20} color="#10B981" />
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.cardSubtitle}>Production: {calculateTotal(item)} kits</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("ReportEdit", { fileName: item.fileName })}
              >
                <Edit2 size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={() => handleDelete(item.fileName)}
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Report")}
        activeOpacity={0.8}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Slate 50/ Gray 100
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827", // Gray 900
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 15,
    color: "#6B7280", // Gray 500
    marginTop: 4,
    fontWeight: "500",
  },

  // Stats Card
  statsCard: {
    backgroundColor: "#10B981", // Emerald 500
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statsIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statsTitle: {
    color: "#D1FAE5", // Emerald 100
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 48,
    marginBottom: 20,
  },
  statsUnit: {
    fontSize: 18,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    fontSize: 13,
  },
  tabTextActive: {
    color: "#10B981",
    fontWeight: "700",
  },

  // Actions
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // Recent List
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllLink: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ECFDF5", // Emerald 50
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardActions: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 12,
    marginLeft: 12,
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 16,
    marginBottom: 8,
  },
  emptyAction: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 16,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
