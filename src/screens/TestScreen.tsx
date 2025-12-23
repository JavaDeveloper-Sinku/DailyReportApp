import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import ProductCard from "../components/ProductCard";

const TestScreen: React.FC = () => {
  // Demo data
  const reportId = "RPT-001";
  const reportDate = "2025-12-23";
  const totalQuantity = 41; // Sum of kits in demo data

  // Button handlers
  const handleSave = () => {
    Alert.alert("Save", "Report saved successfully!");
  };

  const handleGeneratePDF = () => {
    Alert.alert("PDF", "PDF generated and shared!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ===== INFO BOX ===== */}
        <View style={styles.infoBox}>
          <View>
            <Text style={styles.infoLabel}>Report ID</Text>
            <Text style={styles.infoValue}>{reportId}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{reportDate}</Text>
          </View>
        </View>

        {/* Total Quantity */}
        <Text style={styles.total}>Total Quantity: {totalQuantity}</Text>

        {/* ===== PRODUCT CARDS ===== */}
        <ProductCard
          productName="Hand Sanitizer"
          capacities={[
            { value: 100, unit: "ML", kits: 5 },
            { value: 20, unit: "ML", kits: 12 },
            { value: 500, unit: "ML", kits: 3 },
            { value: 10, unit: "ML", kits: 2 },
          ]}
        />

        <ProductCard
          productName="Rice Bag"
          capacities={[
            { value: 1, unit: "KG", kits: 10 },
            { value: 5, unit: "KG", kits: 4 },
          ]}
        />
      </ScrollView>

      {/* ===== BOTTOM BUTTONS ===== */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={handleGeneratePDF}>
          <Text style={styles.btnText}>PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.save]} onPress={handleSave}>
          <Text style={styles.btnText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Bottom space for buttons
  },

  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },

  infoLabel: { fontSize: 12, color: "#6b7280" },
  infoValue: { fontSize: 14, fontWeight: "700", color: "#111827" },

  total: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
    marginHorizontal: 2, // small horizontal margin
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    width: "100%",
  },

  btn: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },

  save: { backgroundColor: "#16a34a", marginRight: 0 },

  btnText: { color: "#fff", fontWeight: "700" },
});
