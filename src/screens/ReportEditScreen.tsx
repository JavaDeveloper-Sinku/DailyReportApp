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
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import {
  readReportByFileName,
  saveReportByFileName,
} from "../utils/fileHelper"; // NEW FUNCTION (Add below)

type RouteParams = {
  ReportEdit: {
    fileName: string;
  };
};

const ReportEditScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, "ReportEdit">>();
  const navigation = useNavigation<any>();

  const { fileName } = route.params;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load report data
  useEffect(() => {
    const fetchReport = async () => {
      const data = await readReportByFileName(fileName);
      setReport(data);
      setLoading(false);
    };
    fetchReport();
  }, []);

  // Save edited report
  const handleSave = async () => {
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
      <ScrollView>
        <Text style={styles.title}>Edit Report</Text>

        {/* DATE FIELD */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={report.date}
          onChangeText={(text) => setReport({ ...report, date: text })}
        />

        {/* TOTAL FIELD */}
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

        {report.products?.map((p: any, i: number) => (
          <View key={i} style={styles.productBox}>
            <TextInput
              style={styles.productInput}
              value={p.name}
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].name = text;
                setReport({ ...report, products: prod });
              }}
            />

            <TextInput
              style={styles.productInput}
              value={p.quantity.toString()}
              keyboardType="numeric"
              onChangeText={(text) => {
                const prod = [...report.products];
                prod[i].quantity = parseInt(text) || 0;
                setReport({ ...report, products: prod });
              }}
            />
          </View>
        ))}

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportEditScreen;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  label: { fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  productBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  productInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    borderColor: "#ccc",
    marginTop: 5,
  },
  saveBtn: {
    backgroundColor: "#2BAE8A",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
