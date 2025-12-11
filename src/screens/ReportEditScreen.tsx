import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import {
  readReportByFileName,
  saveReportByFileName,
} from "../utils/fileHelper";

type RouteParams = {
  ReportEdit: {
    fileName: string;
  };
};

type Product = {
  name: string;
  selectedSize: string;
  quantity: number;
  capacity?: number;
};

type Report = {
  reportId?: string;
  date: string;
  total?: number;
  products: Product[];
  fileName: string;
};

const ReportEditScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "ReportEdit">>();
  const navigation = useNavigation<any>();

  const { fileName } = route.params;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await readReportByFileName(fileName);
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, []);

  const handleSave = async () => {
    if (!report) return;

    const success = await saveReportByFileName(fileName, report);

    if (success) {
      Alert.alert("Saved", "Report updated successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to save report.");
    }
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
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Edit Report</Text>

        {/* REPORT ID */}
        <Text style={styles.label}>Report ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Report ID"
          value={report.reportId || ""}
          onChangeText={(text) => setReport({ ...report, reportId: text })}
        />

        {/* DATE */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={report.date}
          onChangeText={(text) => setReport({ ...report, date: text })}
        />

        {/* TOTAL QUANTITY */}
        <Text style={styles.label}>Total Quantity</Text>
        <TextInput
          style={styles.input}
          value={report.total?.toString() || ""}
          keyboardType="numeric"
          onChangeText={(text) =>
            setReport({ ...report, total: parseInt(text) || 0 })
          }
        />

        {/* PRODUCTS LIST */}
        <Text style={styles.label}>Products</Text>

        {report.products?.map((p: Product, i: number) => (
          <View key={i} style={styles.productBox}>
            <Text style={styles.productLabel}>Product {i + 1}</Text>

            <TextInput
              style={styles.productInput}
              placeholder="Name"
              value={p.name}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].name = text;
                setReport({ ...report, products: prod });
              }}
            />

            <TextInput
              style={styles.productInput}
              placeholder="Selected Size"
              value={p.selectedSize}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].selectedSize = text;
                setReport({ ...report, products: prod });
              }}
            />

            <TextInput
              style={styles.productInput}
              placeholder="Quantity"
              keyboardType="numeric"
              value={p.quantity.toString()}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].quantity = parseInt(text) || 0;
                setReport({ ...report, products: prod });
              }}
            />

            <TextInput
              style={styles.productInput}
              placeholder="Capacity"
              keyboardType="numeric"
              value={p.capacity?.toString() || ""}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].capacity = parseInt(text) || 0;
                setReport({ ...report, products: prod });
              }}
            />
          </View>
        ))}

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE REPORT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#111" },
  label: { fontWeight: "600", marginTop: 15, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: Platform.OS === "android" ? 10 : 12,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  productBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  productLabel: { fontWeight: "600", marginBottom: 6 },
  productInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: Platform.OS === "android" ? 8 : 10,
    marginTop: 6,
    backgroundColor: "#f3f4f6",
  },
  saveBtn: {
    backgroundColor: "#2BAE8A",
    padding: 16,
    borderRadius: 10,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
