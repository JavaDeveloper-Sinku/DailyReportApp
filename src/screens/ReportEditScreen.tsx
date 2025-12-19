import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import {
  readReportByFileName,
  saveReportByFileName,
} from "../utils/fileHelper";

/* ================= TYPES ================= */

type RouteParams = {
  ReportEdit: {
    fileName: string;
  };
};

type Product = {
  name: string;
  capacity: number;
  quantity: number;
};

type Report = {
  date: string;
  products: Product[];
  fileName: string;
};

/* ================= HELPERS ================= */

const formatDateOnly = (date: string) => date?.split("T")[0] || "";

/* ================= SCREEN ================= */

const ReportEditScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "ReportEdit">>();
  const navigation = useNavigation<any>();
  const { fileName } = route.params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD REPORT ================= */

  useEffect(() => {
    const load = async () => {
      const data = await readReportByFileName(fileName);

      if (!data || !data.products) {
        Alert.alert("Error", "Report not found");
        navigation.goBack();
        return;
      }

      setReport({ ...data, fileName });
      setLoading(false);
    };

    load();
  }, []);

  /* ================= GROUP PRODUCTS ================= */

  const groupedProducts = useMemo(() => {
    if (!report) return [];

    const map: Record<string, Product[]> = {};

    report.products.forEach((p) => {
      if (!map[p.name]) map[p.name] = [];
      map[p.name].push(p);
    });

    return Object.entries(map).map(([name, rows]) => ({
      name,
      rows,
    }));
  }, [report]);

  /* ================= TOTAL ================= */

  const totalQuantity = useMemo(() => {
    if (!report) return 0;
    return report.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  }, [report]);

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!report) return;

    const success = await saveReportByFileName(fileName, report);

    success
      ? Alert.alert("Saved", "Report updated successfully")
      : Alert.alert("Error", "Save failed");
  };

  /* ================= PDF ================= */

  const handleGeneratePDF = async () => {
    if (!report) return;

    const rows = report.products
      .map(
        (p) => `
        <tr>
          <td>${p.name}</td>
          <td>${p.capacity}</td>
          <td>${p.quantity}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <html>
        <body style="font-family:Arial;padding:20px">
          <h2 style="text-align:center">Product Report</h2>

          <p><b>Report ID:</b> ${fileName}</p>
          <p><b>Date:</b> ${formatDateOnly(report.date)}</p>
          <p><b>Total Quantity:</b> ${totalQuantity}</p>

          <table border="1" width="100%" cellspacing="0" cellpadding="6">
            <tr>
              <th>Product</th>
              <th>Capacity</th>
              <th>Quantity</th>
            </tr>
            ${rows}
          </table>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  /* ================= UI ================= */

  if (loading || !report) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>

        {/* ===== HEADER WITH REPORT ID + DATE ===== */}
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.label}>Report ID</Text>
            <Text style={styles.value}>{fileName}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {formatDateOnly(report.date)}
            </Text>
          </View>
        </View>

        {/* TOTAL */}
        <Text style={styles.total}>Total Quantity: {totalQuantity}</Text>

        {/* PRODUCT CARDS */}
        {groupedProducts.map((product) => (
          <View key={product.name} style={styles.card}>
            <Text style={styles.cardTitle}>{product.name}</Text>

            {product.rows.map((row, idx) => (
              <View key={idx} style={styles.row}>

                {/* CAPACITY */}
                <View style={styles.col}>
                  <Text style={styles.small}>Capacity</Text>
                  <Text style={styles.capacity}>{row.capacity}</Text>
                </View>

                {/* QUANTITY */}
                <View style={styles.col}>
                  <Text style={styles.small}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(row.quantity)}
                    onChangeText={(t) => {
                      const updated = report.products.map((p) =>
                        p === row
                          ? { ...p, quantity: parseInt(t) || 0 }
                          : p
                      );
                      setReport({ ...report, products: updated });
                    }}
                  />
                </View>

              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM BUTTONS */}
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

export default ReportEditScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerBox: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    
  },

  label: { fontSize: 12, color: "#6b7280" },
  value: { fontSize: 14, fontWeight: "700" },

  total: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  cardTitle: { fontWeight: "700", marginBottom: 10 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  col: { alignItems: "center" },

  small: { fontSize: 12, color: "#6b7280" },

  capacity: { fontSize: 16, fontWeight: "700" },

  input: {
    width: 70,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: Platform.OS === "android" ? 6 : 8,
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    width: "100%",
  },

  btn: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },

  save: { backgroundColor: "#16a34a", marginRight: 0 },

  btnText: { color: "#fff", fontWeight: "700" },
});
