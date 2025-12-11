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
} from "react-native";
import { saveReport } from "../utils/fileHelper";

export default function ReportScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Water Bottle",
      sizes: ["500ml", "100ml", "50ml", "10ml"],
      selectedSize: "500ml",
      quantity: "",
      image: require("../../assets/water-bottle.png"),
    },
    {
      id: 2,
      name: "Water Pouch",
      sizes: ["500ml", "100ml", "50ml", "10ml"],
      selectedSize: "500ml",
      quantity: "",
      image: require("../../assets/water-pouch.png"),
    },
  ]);

  const handleQuantityChange = (id: number, value: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const changeSize = (id: number, size: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedSize: size } : item
      )
    );
  };

  const calculateTotal = () => {
    return products.reduce(
      (sum, p) => sum + (parseInt(p.quantity) || 0),
      0
    );
  };

  const handleSave = async () => {
    const selectedProducts = products
      .filter((p) => parseInt(p.quantity) > 0)
      .map((p) => ({
        name: p.name,
        selectedSize: p.selectedSize,
        quantity: p.quantity,
      }));

    if (selectedProducts.length === 0) {
      Alert.alert("No Selection", "Please enter quantity for at least one item.");
      return;
    }

    const reportData = {
      date: new Date().toISOString(),
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* PRODUCT CARDS */}
      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <Image source={product.image} style={styles.productImage} />

          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>{product.name}</Text>

            <View style={styles.sizesRow}>
              {product.sizes.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => changeSize(product.id, s)}
                >
                  <Text
                    style={[
                      styles.sizeTag,
                      product.selectedSize === s && styles.activeSizeTag,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.qtyText}>Quantity</Text>
            <TextInput
              placeholder="Enter Quantity"
              style={styles.input}
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={product.quantity}
              onChangeText={(text) =>
                handleQuantityChange(product.id, text)
              }
            />
          </View>
        </View>
      ))}

      {/* SUMMARY */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryHeading}>Summary</Text>

        {products.map((p) => (
          <View key={p.id} style={styles.summaryRow}>
            <Text style={styles.summaryName}>{p.name}</Text>

            <View style={styles.sizeBadge}>
              <Text style={styles.sizeBadgeText}>{p.selectedSize}</Text>
            </View>

            <Text style={styles.summaryQty}>{p.quantity || 0} kit</Text>
          </View>
        ))}

        <View style={styles.summaryDivider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Quantity</Text>
          <Text style={styles.totalValue}>{calculateTotal()} kit</Text>
        </View>
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 15, paddingTop: 10 },

  /* PRODUCT CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 15,
    elevation: 3,
  },
  productImage: { width: 60, height: 60, marginRight: 15, resizeMode: "contain" },
  productTitle: { fontSize: 18, fontWeight: "700" },

  sizesRow: { flexDirection: "row", marginTop: 10 },
  sizeTag: {
    backgroundColor: "#d5f5e3",
    color: "#2e8b57",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    borderRadius: 10,
    fontSize: 12,
  },
  activeSizeTag: {
    backgroundColor: "#1abc9c",
    color: "#fff",
    fontWeight: "700",
  },

  qtyText: { marginTop: 10, fontWeight: "600" },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  /* SUMMARY */
  summaryContainer: {
    marginTop: 25,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  summaryHeading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryName: {
    fontSize: 16,
    fontWeight: "600",
    width: "45%",
    color: "#444",
  },
  sizeBadge: {
    backgroundColor: "#1abc9c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sizeBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  summaryQty: { fontSize: 16, fontWeight: "700", color: "#000" },

  summaryDivider: { height: 1, backgroundColor: "#bbb", marginVertical: 15 },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#333" },
  totalValue: { fontSize: 20, fontWeight: "900", color: "#1abc9c" },

  saveBtn: {
    backgroundColor: "#1abc9c",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 25,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
