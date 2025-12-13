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
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.title}>Edit Report</Text>

        {/* HEADER ROW */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerLabel}>Report ID</Text>
            <Text style={styles.headerValue}>
              {report.reportId || "N/A"}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.headerLabel}>Date</Text>
            <Text style={styles.headerValue}>{report.date}</Text>
          </View>
        </View>

        {/* TOTAL */}
        <Text style={styles.label}>Total Quantity</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={report.total?.toString() || ""}
          onChangeText={(text) =>
            setReport({ ...report, total: parseInt(text) || 0 })
          }
        />

        {/* PRODUCTS */}
        <Text style={styles.label}>Products</Text>

        {report.products.map((p, i) => (
          <View key={i} style={styles.productBox}>
            <Text style={styles.productLabel}>{p.name}</Text>

            <TextInput
              style={styles.productInput}
              keyboardType="numeric"
              placeholder="Quantity"
              value={p.quantity.toString()}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].quantity = parseInt(text) || 0;
                setReport({ ...report, products: prod });
              }}
            />

            {p.capacity !== undefined && (
              <TextInput
                style={styles.productInput}
                keyboardType="numeric"
                placeholder="Capacity"
                value={p.capacity.toString()}
                onChangeText={(text) => {
                  const prod = [...report.products];
                  prod[i].capacity = parseInt(text) || 0;
                  setReport({ ...report, products: prod });
                }}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {/* FIXED SAVE */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE REPORT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    margin: 20,
    textAlign: "center",
  },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  headerLabel: {
    fontSize: 23,
    color: "#6b7280",
    marginBottom: 4,
  },
  headerValue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111827",
  },

  label: {
    fontWeight: "600",
    marginTop: 15,
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: Platform.OS === "android" ? 10 : 12,
    borderRadius: 8,
    marginTop: 5,
    marginHorizontal: 20,
    backgroundColor: "#fff",
  },
  productBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
  },
  productLabel: {
    fontWeight: "600",
    marginBottom: 6,
  },
  productInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: Platform.OS === "android" ? 8 : 10,
    marginTop: 6,
    backgroundColor: "#f3f4f6",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  saveBtn: {
    backgroundColor: "#2BAE8A",
    padding: 16,
    borderRadius: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
