"use client";

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listAllReports, deleteReport } from "../utils/fileHelper";
import { Edit2, Trash2 } from "lucide-react-native";

const { width } = Dimensions.get("window");

type ReportItem = {
  date: string;
  fileName: string;
  total?: number;
};

const ReportListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"All" | "Weekly" | "Monthly">("Weekly");
  const [search, setSearch] = useState("");

  const loadReports = async () => {
    const allReports = await listAllReports();
    setReports(allReports);
  };

  useEffect(() => {
    loadReports();
  }, []);

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

  let filteredData = filterByRange(reports).filter((item) => {
    const text = search.toLowerCase().trim();
    const date = new Date(item.date).toLocaleDateString().toLowerCase();
    return date.includes(text);
  });

  filteredData = filteredData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            await deleteReport(fileName);
            loadReports();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Range Tabs */}
      <View style={styles.rangeRow}>
        {(["All", "Weekly", "Monthly"] as const).map((r) => (
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

      {/* Search */}
      <View style={styles.searchInputWrap}>
        <TextInput
          placeholder="Search by date..."
          placeholderTextColor="#6b7280"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <View style={styles.listWrap}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.fileName || item.date}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                <Text style={styles.cardTitle}>
                  Date: {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.cardTitle}>
                  Total Quantity: {item.total || 0} kit
                </Text>
              </TouchableOpacity>

              {/* Edit + Delete icons */}
              <View style={styles.iconRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ReportEdit", { fileName: item.fileName })
                  }
                  style={styles.iconBtn}
                >
                  <Edit2 size={22} color="#1abc9c" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.fileName)}
                  style={styles.iconBtn}
                >
                  <Trash2 size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReportListScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 15 : 0,
  },

  rangeRow: {
    width: width * 0.9,
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  rangeTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2f8a6d",
  },
  rangeTabActive: { backgroundColor: "#2f8a6d" },
  rangeText: { color: "#2f8a6d", fontWeight: "700" },
  rangeTextActive: { color: "#fff" },

  searchInputWrap: { width: width * 0.9, marginTop: 12 },
  searchInput: {
    height: 42,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    fontSize: 14,
  },

  listWrap: { width: width * 0.9, marginTop: 15, flex: 1 },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },

  iconRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { padding: 4 },
});
