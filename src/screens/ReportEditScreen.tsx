"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { readReportByFileName, saveReportByFileName } from "../utils/fileHelper";

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

const formatDateOnly = (date: string) => date?.split("T")[0] || "";

const ReportEditScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "ReportEdit">>();
  const navigation = useNavigation<any>();
  const { fileName } = route.params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  const groupedProducts = useMemo(() => {
    if (!report?.products?.length) return [];

    const map: Record<string, Product[]> = {};
    report.products.forEach((p) => {
      if (!map[p.name]) map[p.name] = [];
      map[p.name].push(p);
    });

    return Object.entries(map).map(([name, rows]) => ({ name, rows }));
  }, [report]);

  const totalQuantity = useMemo(() => {
    if (!report?.products?.length) return 0;
    return report.products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  }, [report]);

  const handleSave = async () => {
    if (!report) return;
    const success = await saveReportByFileName(fileName, report);

    success
      ? Alert.alert("Saved", "Report updated successfully")
      : Alert.alert("Error", "Save failed");
  };

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

  if (loading || !report) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <View>
            <Text style={styles.infoLabel}>Report ID</Text>
            <Text style={styles.infoValue}>{fileName}</Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDateOnly(report.date)}</Text>
          </View>
        </View>

        <Text style={styles.total}>Total Quantity: {totalQuantity}</Text>

       {groupedProducts.map((product) => (
      <ProductCard
    key={product.name}
    productName={product.name}
    capacities={product.rows.map((r) => ({
      value: r.capacity,       // yaha actual capacity
      unit: "PCS",
      kits: r.quantity,        // yaha actual quantity
    }))}
    onChange={(updatedCapacities) => {
      if (!report?.products?.length) return;

      const updatedProducts = report.products.map((p) => {
        if (p.name === product.name) {
          const matchedCap = updatedCapacities.find(
            (u) => u.value === p.capacity
          );
          return matchedCap ? { ...p, quantity: matchedCap.kits } : p;
        }
        return p;
      });

      setReport({ ...report, products: updatedProducts });
    }}
      />
    ))}

      </ScrollView>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  scrollContent: { padding: 16, paddingBottom: 120 },

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

  total: { fontSize: 16, fontWeight: "700", marginBottom: 16, color: "#111827", marginHorizontal: 2 },

  bottom: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    width: "100%",
  },

  btn: { flex: 1, backgroundColor: "#2563EB", padding: 14, borderRadius: 8, alignItems: "center", marginRight: 8 },
  save: { backgroundColor: "#16a34a", marginRight: 0 },
  btnText: { color: "#fff", fontWeight: "700" },
});
