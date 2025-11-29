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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listAllReports } from "../utils/fileHelper";

const { width } = Dimensions.get("window");

type ReportItem = {
  date: string;
  fileName: string;
  products: {
    name: string;
    selectedSize: string;
    quantity: string;
  }[];
};

const ReportListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [activeRange, setActiveRange] = useState<"All" | "Weekly" | "Monthly">("Weekly");
  const [activeType, setActiveType] = useState<"New" | "Old">("New");
  const [search, setSearch] = useState("");

  // Load all reports
  const loadReports = async () => {
    const allReports = await listAllReports();
    setReports(allReports);
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter by range
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

  // Search and filter
 let filteredData = filterByRange(reports).filter((item) => {
  const text = search.toLowerCase().trim();
  const date = new Date(item.date).toLocaleDateString().toLowerCase();
  const qtyMatch = item.products?.some((p) =>
    p.quantity?.toString().toLowerCase().includes(text)
  );
  return date.includes(text) || qtyMatch;
});

  // Sort
  filteredData = filteredData.sort((a, b) => {
    if (activeType === "New") return new Date(b.date).getTime() - new Date(a.date).getTime();
    else return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top buttons */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.typeBtn, activeType === "New" && styles.typeBtnActive]}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={[styles.typeBtnText, activeType === "New" && styles.typeBtnTextActive]}>
            New Report
          </Text>
        </TouchableOpacity>
      </View>

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
          placeholder="Search reports..."
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
  keyExtractor={(item) => item.fileName || item.date} // fallback added
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ReportEdit", {
          fileName: item.fileName,
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>
          Date: {new Date(item.date).toLocaleDateString()}
        </Text>
        {item.products?.map((p, idx) => (
          <Text key={idx} style={styles.cardProduct}>
            {p.name} ({p.selectedSize}) : {p.quantity} kit
          </Text>
        ))}
      </View>
    </TouchableOpacity>
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
  filtersRow: {
    width: width * 0.9,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#eef2f4",
    borderRadius: 20,
  },
  typeBtnActive: { backgroundColor: "#2f8a6d" },
  typeBtnText: { color: "#374151", fontWeight: "600" },
  typeBtnTextActive: { color: "#fff" },

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
  },
  rangeTabActive: { backgroundColor: "#2f8a6d" },
  rangeText: { color: "#6b7280", fontWeight: "700" },
  rangeTextActive: { color: "#fff" },

  searchInputWrap: { width: width * 0.9, marginTop: 10 },
  searchInput: {
    height: 42,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    fontSize: 14,
  },

  listWrap: { width: width * 0.9, marginTop: 12, flex: 1 },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  cardProduct: { fontSize: 14, color: "#0f172a", marginLeft: 5 },
});
