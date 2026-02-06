"use client";

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { listAllReports, deleteReport } from "../utils/fileHelper";
import {
  Edit2,
  Trash2,
  Search,
  Filter,
  CalendarDays,
  FileText,
  ChevronRight
} from "lucide-react-native";

type ReportItem = {
  date: string;
  fileName: string;
  total?: number;
};

const ReportListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"All" | "Weekly" | "Monthly">("All");
  const [search, setSearch] = useState("");

  const loadReports = async () => {
    try {
      const allReports = await listAllReports();
      setReports(allReports);
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const filterByRange = (data: ReportItem[]) => {
    const now = new Date();
    if (activeRange === "All") return data;

    return data.filter((item) => {
      const diff = (now.getTime() - new Date(item.date).getTime()) / (1000 * 60 * 60 * 24);
      if (activeRange === "Weekly") return diff <= 7;
      if (activeRange === "Monthly") return diff <= 30;
      return true;
    });
  };

  const getFilteredData = () => {
    let data = filterByRange(reports);

    if (search.trim()) {
      const text = search.toLowerCase().trim();
      data = data.filter((item) => {
        const dateStr = new Date(item.date).toLocaleDateString().toLowerCase();
        return dateStr.includes(text);
      });
    }

    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const filteredData = getFilteredData();

  const handleDelete = (fileName: string) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteReport(fileName);
            if (success) loadReports();
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>All Reports</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search reports..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <View style={styles.filterLabelBox}>
          <Filter size={16} color="#6B7280" />
          <Text style={styles.filterLabel}>Filter:</Text>
        </View>
        {(["All", "Weekly", "Monthly"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setActiveRange(r)}
            style={[styles.filterTab, activeRange === r && styles.filterTabActive]}
          >
            <Text style={[styles.filterText, activeRange === r && styles.filterTextActive]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.fileName}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CalendarDays size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No reports found</Text>
            {activeRange !== 'All' && <Text style={styles.emptySubText}>Try changing the filter</Text>}
          </View>
        }
        renderItem={({ item }) => {
          const dateObj = new Date(item.date);
          const month = dateObj.toLocaleDateString(undefined, { month: 'short' }).toUpperCase();
          const day = dateObj.getDate();

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.cardMain}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                {/* CALENDAR LEAF DATE VISUAL */}
                <View style={styles.calendarBox}>
                  <View style={styles.calendarTop}>
                    <Text style={styles.calendarMonth}>{month}</Text>
                  </View>
                  <View style={styles.calendarBody}>
                    <Text style={styles.calendarDay}>{day}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Production Report</Text>
                  <Text style={styles.cardSubtitle}>
                    {dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      Total: {item.total || 0}
                    </Text>
                  </View>
                </View>

                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ReportEdit", { fileName: item.fileName })
                  }
                  style={styles.actionBtn}
                >
                  <Edit2 size={18} color="#6B7280" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.fileName)}
                  style={[styles.actionBtn, styles.deleteBtn]}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default ReportListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  listContent: {
    paddingBottom: 40,
  },

  // Header
  headerContainer: {
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111827",
  },

  // Filters
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    gap: 4
  },
  filterLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  filterTabActive: {
    backgroundColor: "#10B981",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  emptySubText: {
    fontSize: 14,
    color: "#D1D5DB",
    marginTop: 4,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12, // Compact padding
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  // CALENDAR BOX STYLES
  calendarBox: {
    width: 50,
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  calendarTop: {
    backgroundColor: '#EF4444', // Distinct Red for calendar feel
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonth: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  calendarBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  calendarDay: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1F2937',
  },

  // Content
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: "#F0FDF4", // Light green bg
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D", // Dark green text
  },

  // Actions
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#F3F4F6",
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },
});
