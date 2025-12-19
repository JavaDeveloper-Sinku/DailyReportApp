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
  Dimensions,
} from "react-native";
import { saveReport } from "../utils/fileHelper";

export default function ReportScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

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
    <View style={styles.container}>
    
        {products.map((product) => (
          <View key={product.id} style={styles.card}>
            <Image source={product.image} style={styles.productImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle}>{product.name}</Text>

              {/* Horizontal Sizes + Quantity */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
              >
                {product.sizes.map((size) => (
                  <View key={size} style={styles.sizeInputBox}>
                    <Text style={styles.sizeLabel}>{size}</Text>
                    <TextInput
                      placeholder="Qty"
                      style={styles.sizeInput}
                      keyboardType="numeric"
                      value={product.quantityBySize[size] || ""}
                      onChangeText={(text) =>
                        handleQuantityChange(product.id, size, text)
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryHeading}>Summary</Text>

          <ScrollView
            style={styles.summaryScroll}
            showsVerticalScrollIndicator={false}
          >
            {products.map((p) =>
              p.sizes.map((size) =>
                (parseInt(p.quantityBySize[size] || "0") || 0) > 0 ? (
                  <View key={p.id + size} style={styles.summaryRow}>
                    <Text style={styles.summaryName}>{p.name}</Text>
                    <View style={styles.sizeBadge}>
                      <Text style={styles.sizeBadgeText}>{size}</Text>
                    </View>
                    <Text style={styles.summaryQty}>
                      {p.quantityBySize[size]} kit
                    </Text>
                  </View>
                ) : null
              )
            )}
          </ScrollView>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Quantity</Text>
            <Text style={styles.totalValue}>{calculateTotal()} kit</Text>
          </View>
        </View>
      

      {/* SAVE BUTTON FIXED */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
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

  sizeInputBox: { width: 70, alignItems: "center", marginRight: 10 },
  sizeLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4, textAlign: "center" },
  sizeInput: {
    width: 60,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    textAlign: "center",
  },

  /* SUMMARY */
  summaryContainer: {
    marginTop: 25,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  summaryHeading: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#333" },
  summaryScroll: { maxHeight: 220 }, // scrollable inside summary
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryName: { fontSize: 16, fontWeight: "600", width: "45%", color: "#444" },
  sizeBadge: { backgroundColor: "#1abc9c", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sizeBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  summaryQty: { fontSize: 16, fontWeight: "700", color: "#000" },
  summaryDivider: { height: 1, backgroundColor: "#bbb", marginVertical: 15 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#333" },
  totalValue: { fontSize: 20, fontWeight: "900", color: "#1abc9c" },

  saveBtn: {
    backgroundColor: "#1abc9c",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    left: 15,
    right: 15,
  },
  saveText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});
