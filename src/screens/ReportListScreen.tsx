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
  Image,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type ReportItem = {
  id: string;
  date: string;
  qty: string;
};

// Sample reports
const sampleReports: ReportItem[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `RPT-${1000 + i}`,
  date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
  qty: "600kit",
}));

const ReportListScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const newReport: ReportItem | undefined = route.params?.newReport;

  const [reports, setReports] = useState<ReportItem[]>(sampleReports);
  const [activeRange, setActiveRange] =
    useState<"All" | "Weekly" | "Monthly">("Weekly");
  const [activeType, setActiveType] = useState<"New" | "Old">("Old");
  const [search, setSearch] = useState("");

  const [productCount, setProductCount] = useState(reports.length);

  // Add new report coming from Report Screen
  useEffect(() => {
    if (newReport) {
      setReports((prev) => [newReport, ...prev]);
      setProductCount((c) => c + 1);
    }
  }, [newReport]);

  // Range filter
  const filterByRange = (data: ReportItem[]) => {
    const now = new Date();

    if (activeRange === "All") return data;

    if (activeRange === "Weekly") {
      return data.filter((item) => {
        const diff =
          (now.getTime() - new Date(item.date).getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 7;
      });
    }

    if (activeRange === "Monthly") {
      return data.filter((item) => {
        const diff =
          (now.getTime() - new Date(item.date).getTime()) /
          (1000 * 60 * 60 * 24);
        return diff <= 30;
      });
    }

    return data;
  };

  // 🔥 Powerful Search + Range + Sorting (New/Old)
  let filteredData = filterByRange(reports).filter((item) => {
    const searchText = search.toLowerCase().trim();

    const id = item.id.toLowerCase();
    const qty = item.qty.toLowerCase();
    const date = new Date(item.date)
      .toLocaleDateString()
      .toLowerCase();

    return (
      id.includes(searchText) ||
      qty.includes(searchText) ||
      date.includes(searchText)
    );
  });

  // 🔥 Sort logic (New → latest first, Old → oldest first)
  filteredData = filteredData.sort((a, b) => {
    if (activeType === "New") {
      return (
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      return (
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
  });

  return (
  <SafeAreaView style={styles.safe}>
      {/* Top buttons (New / Old) */}
      <View style={styles.filtersRow}>
        <View style={styles.filterTypes}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              activeType === "New" && styles.typeBtnActive,
            ]}
            onPress={() => navigation.navigate("Report")}
          >
            <Text
              style={[
                styles.typeBtnText,
                activeType === "New" && styles.typeBtnTextActive,
              ]}
            >
              New Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Range tabs */}
      <View style={styles.rangeRow}>
        {(["All", "Weekly", "Monthly"] as const).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setActiveRange(r)}
            style={[
              styles.rangeTab,
              activeRange === r && styles.rangeTabActive,
            ]}
          >
            <Text
              style={[
                styles.rangeText,
                activeRange === r && styles.rangeTextActive,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search box */}
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
          keyExtractor={(i) => i.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ReportEdit", {
                  report: item,
                })
              }
            >
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>
                  Report Id : {item.id}
                </Text>
                <Text style={styles.cardDate}>
                  Date : {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.cardQty}>{item.qty}</Text>
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
  header: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  productBadge: {
    backgroundColor: "#e6f7ee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
  },
  productBadgeText: {
    fontWeight: "700",
    color: "#0b6b4a",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ddd",
  },

  filtersRow: {
    width: width * 0.9,
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterTypes: {
    flexDirection: "row",
    gap: 8,
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#eef2f4",
    borderRadius: 20,
  },
  typeBtnActive: {
    backgroundColor: "#2f8a6d",
  },
  typeBtnText: {
    color: "#374151",
    fontWeight: "600",
  },
  typeBtnTextActive: {
    color: "#ffffff",
  },

  searchCircle: {
    backgroundColor: "#2f8a6d",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  rangeRow: {
    width: width * 0.9,
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-start",
    gap: 8,
  },
  rangeTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  rangeTabActive: {
    backgroundColor: "#2f8a6d",
  },
  rangeText: {
    color: "#6b7280",
    fontWeight: "700",
  },
  rangeTextActive: {
    color: "#fff",
  },

  searchInputWrap: {
    width: width * 0.9,
    marginTop: 10,
  },
  searchInput: {
    height: 42,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    fontSize: 14,
  },

  listWrap: {
    width: width * 0.9,
    marginTop: 12,
    flex: 1,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  cardRight: {
    alignItems: "flex-end",
    minWidth: 72,
  },
  cardQty: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
});
