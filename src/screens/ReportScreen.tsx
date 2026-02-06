import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { saveReport } from "../utils/fileHelper";
import { Save, Check, Package, Layers } from "lucide-react-native";

export default function ReportScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Water Bottle",
      sizes: ["500ml", "100ml", "50ml", "10ml"],
      quantityBySize: {} as Record<string, string>,
      image: require("../../assets/water-bottle.png"),
    },
    {
      id: 2,
      name: "Water Pouch",
      sizes: ["500ml", "100ml", "50ml", "10ml"],
      quantityBySize: {} as Record<string, string>,
      image: require("../../assets/water-pouch.png"),
    },
  ]);

  const handleQuantityChange = (id: number, size: string, value: string) => {
    // validate number input
    if (value && !/^\d+$/.test(value)) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            quantityBySize: { ...p.quantityBySize, [size]: value },
          }
          : p
      )
    );
  };

  const calculateTotal = () => {
    return products.reduce(
      (sum, p) =>
        sum +
        Object.values(p.quantityBySize).reduce(
          (s, q) => s + (parseInt(q) || 0),
          0
        ),
      0
    );
  };

  const currentTotal = calculateTotal();

  const handleSave = async () => {
    const selectedProducts = products
      .map((p) =>
        p.sizes
          .map((size) => ({
            name: p.name,
            selectedSize: size,
            quantity: parseInt(p.quantityBySize[size] || "0"),
          }))
          .filter((x) => x.quantity > 0)
      )
      .flat();

    if (selectedProducts.length === 0) {
      Alert.alert(
        "No Selection",
        "Please enter quantity for at least one item."
      );
      return;
    }

    const reportData = {
      date: new Date().toISOString(),
      total: selectedProducts.reduce((sum, p) => sum + p.quantity, 0),
      products: selectedProducts,
    };

    try {
      await saveReport(reportData);
      Alert.alert("Saved", "Your report has been saved!", [
        { text: "OK", onPress: () => navigation.navigate("ReportList") },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save report.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>New Entry</Text>
            <Text style={styles.headerSubtitle}>Select products and enter quantities</Text>
          </View>

          {/* Product List */}
          <View style={styles.listContainer}>
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <View style={styles.imageContainer}>
                    <Image source={product.image} style={styles.productImage} />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{product.name}</Text>
                    <Text style={styles.productMeta}>{product.sizes.length} sizes available</Text>
                  </View>
                </View>

                <View style={styles.separator} />

                {/* List of Sizes (Rows: Left Label, Right Input) */}
                <View style={styles.sizeListContainer}>
                  {product.sizes.map((size) => (
                    <View key={size} style={styles.sizeRow}>
                      <Text style={styles.sizeLabel}>{size}</Text>
                      <TextInput
                        placeholder="0"
                        placeholderTextColor="#9CA3AF"
                        style={styles.rowInput}
                        keyboardType="numeric"
                        value={product.quantityBySize[size] || ""}
                        onChangeText={(text) =>
                          handleQuantityChange(product.id, size, text)
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Live Summary Receipt */}
          {currentTotal > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Layers size={20} color="#4B5563" />
                <Text style={styles.summaryTitle}>Summary</Text>
              </View>

              <View style={styles.summaryList}>
                {products.map((p) =>
                  p.sizes.map((size) => {
                    const qty = parseInt(p.quantityBySize[size] || "0");
                    if (qty > 0) {
                      return (
                        <View key={p.id + size} style={styles.summaryRow}>
                          <Text style={styles.summaryItemText}>
                            {p.name} <Text style={styles.summarySizeText}>({size})</Text>
                          </Text>
                          <Text style={styles.summaryItemQty}>{qty}</Text>
                        </View>
                      );
                    }
                    return null;
                  })
                )}
              </View>

              <View style={styles.summaryFooter}>
                <Text style={styles.totalLabel}>Total Items</Text>
                <Text style={styles.totalValue}>{currentTotal}</Text>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Actions */}
      <View style={[styles.footer, { paddingBottom: Platform.OS === 'ios' ? 0 : 20 }]}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
          <Save size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Save Report</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for footer
  },

  // Header
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },

  // List
  listContainer: {
    gap: 20,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  productImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  productMeta: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },

  // Size List (Rows)
  sizeListContainer: {
    gap: 12,
  },
  sizeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 8,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sizeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  rowInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    minWidth: 80,
  },

  // Summary
  summaryCard: {
    marginTop: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: 'dashed',
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  summaryList: {
    marginBottom: 16,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItemText: {
    fontSize: 14,
    color: "#4B5563",
  },
  summarySizeText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  summaryItemQty: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  summaryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
