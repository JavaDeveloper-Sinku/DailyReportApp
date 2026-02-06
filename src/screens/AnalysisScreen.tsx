"use client";

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { listAllReports } from "../utils/fileHelper";
import { BarChart3, TrendingUp, Calendar, Package } from "lucide-react-native";

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

// Colors matching our theme
const THEME_COLOR = "#10B981";

const AnalysisScreen: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"Weekly" | "Monthly">("Weekly");

  const loadReports = async () => {
    try {
      const allReports = await listAllReports();
      setReports(allReports);
    } catch (e) {
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const getFilteredReports = () => {
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

  const filteredReports = getFilteredReports();
  const totalProduction = filteredReports.reduce((sum, r) => sum + calculateTotal(r), 0);
  const averageProduction = filteredReports.length > 0 ? Math.round(totalProduction / filteredReports.length) : 0;

  // Breakdown by Product Name
  const productBreakdown = filteredReports.reduce((acc, r) => {
    r.products?.forEach((p) => {
      acc[p.name] = (acc[p.name] || 0) + p.quantity;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Production Analysis</Text>
          <Text style={styles.headerSubtitle}>Overview of your manufacturing output</Text>
        </View>

        {/* Range Switcher */}
        <View style={styles.rangeContainer}>
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

        {/* Key Metrics Grid */}
        <View style={styles.statsGrid}>
          {/* Total Card */}
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconBoxPrimary}>
              <BarChart3 size={24} color="#fff" />
            </View>
            <Text style={styles.statLabelLight}>Total Production</Text>
            <Text style={styles.statValueLight}>{totalProduction}</Text>
            <Text style={styles.statUnitLight}>kits</Text>
          </View>

          {/* Average Card */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <TrendingUp size={24} color={THEME_COLOR} />
            </View>
            <Text style={styles.statLabel}>Daily Average</Text>
            <Text style={styles.statValue}>{averageProduction}</Text>
            <Text style={styles.statUnit}>kits / report</Text>
          </View>
        </View>

        {/* Product Breakdown */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Product Breakdown</Text>
          {Object.entries(productBreakdown).length > 0 ? (
            Object.entries(productBreakdown).map(([name, qty], index) => (
              <View key={name} style={styles.breakdownCard}>
                <View style={styles.breakdownInfo}>
                  <View style={[styles.dot, { backgroundColor: index % 2 === 0 ? '#3B82F6' : '#8B5CF6' }]} />
                  <Text style={styles.breakdownName}>{name}</Text>
                </View>
                <Text style={styles.breakdownValue}>{qty} kits</Text>
                {/* Simple Bar visual */}
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, {
                    width: `${Math.min((qty / totalProduction) * 100, 100)}%`,
                    backgroundColor: index % 2 === 0 ? '#3B82F6' : '#8B5CF6'
                  }]} />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No data for this period</Text>
            </View>
          )}
        </View>

        {/* Recent History List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>History ({activeRange})</Text>
          {filteredReports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, idx) => (
            <View key={idx} style={styles.historyRow}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIcon}>
                  <Calendar size={16} color="#6B7280" />
                </View>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <Text style={styles.historyValue}>{calculateTotal(item)} kits</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },

  // Range Tabs
  rangeContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  rangeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  rangeTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rangeText: {
    fontWeight: "600",
    color: "#6B7280",
    fontSize: 14,
  },
  rangeTextActive: {
    color: "#111827",
    fontWeight: "700",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statCardPrimary: {
    backgroundColor: THEME_COLOR,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIconBoxPrimary: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabelLight: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  statValueLight: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statUnit: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  statUnitLight: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 2,
  },

  // Sections
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  // Breakdown
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  breakdownName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  breakdownValue: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },

  // History Row
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  historyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  historyDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  historyValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D1D5DB'
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16
  }
});
