import React, { useState, useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { listAllReports, deleteReport } from "../utils/fileHelper";
import { Edit2, Trash2 } from "lucide-react-native";

type RecentReport = {
  id: string;
  fileName: string;
  date: string;
  qty: string;
};

const DailyReportScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

 const loadReports = async () => {
  try {
    const reports = await listAllReports();

    const mappedReports = reports.map((r, index) => ({
      id: r.reportId || `RPT-${index + 1}`, // use reportId if exists
      fileName: r.fileName,
      date: r.date || new Date().toISOString(),
      qty: r.total
        ? `${r.total} kit`
        : calculateQtyText(r.products),
    }));

    setRecentReports(mappedReports);
  } catch (err) {
    console.log("Error loading:", err);
  }
};

const calculateQtyText = (products: any[]) => {
  if (!products) return "0 kit";
  let totalQty = products.reduce(
    (sum, p) => sum + (parseInt(p.quantity) || 0),
    0
  );
  let totalCapacity = products.reduce(
    (sum, p) => sum + (parseInt(p.capacity) || 0),
    0
  );
  return `${totalQty} kit (Capacity: ${totalCapacity})`;
};

  // Delete report
  const handleDelete = (fileName: string) => {
    Alert.alert("Delete Report", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteReport(fileName);
          if (success) {
            loadReports();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Buttons */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.mainButtonText}>NEW_REPORT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("ReportList")}
      >
        <Text style={styles.secondaryButtonText}>Report_List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("UserForm")}
      >
        <Text style={styles.secondaryButtonText}>User_Form</Text>
      </TouchableOpacity>

      {/* Recent Reports */}
      <View style={styles.recentBox}>
        <Text style={styles.recentTitle}>Recent Reports</Text>

        <FlatList
          data={recentReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                <Text style={styles.reportId}>{item.id}</Text>
                <Text style={styles.reportDate}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
                <Text style={styles.reportQty}>{item.qty}</Text>
              </TouchableOpacity>

              {/* Edit Icon */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() =>
                  navigation.navigate("ReportEdit", { fileName: item.fileName })
                }
              >
                <Edit2 size={22} color="#1abc9c" />
              </TouchableOpacity>

              {/* Delete Icon */}
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => handleDelete(item.fileName)}
              >
                <Trash2 size={22} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatBtn}
        onPress={() => navigation.navigate("Report")}
      >
        <Text style={styles.floatBtnPlus}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DailyReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  mainButton: {
    backgroundColor: "#53BFA5",
    padding: 16,
    alignItems: "center",
    borderRadius: 6,
    marginTop: 40,
    marginBottom: 10,
  },
  mainButtonText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryButton: {
    padding: 16,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },

  recentBox: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
  },
  recentTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },

  reportCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  reportId: { fontWeight: "700", fontSize: 14 },
  reportDate: { fontSize: 12, color: "#666" },
  reportQty: { fontSize: 16, fontWeight: "700", marginTop: 4 },

  iconBtn: { padding: 8, marginLeft: 8 },

  floatBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#2BAE8A",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatBtnPlus: {
    fontSize: 32,
    color: "#fff",
  },
});
