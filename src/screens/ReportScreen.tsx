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

  const handleSave = () => {
    Alert.alert("Report Saved", "Your report has been saved successfully.");
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER REMOVED */}

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.tabTextActive}>New Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inactiveTab} onPress={() => navigation.navigate("ReportList")} >
          <Text style={styles.tabTextInactive}>Old Reports</Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCTS */}
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
      <View style={styles.summary}>
        {products.map((p) => (
          <Text key={p.id} style={styles.summaryText}>
            {p.name} ({p.selectedSize}) .......... {p.quantity || 0} kit
          </Text>
        ))}

        <View style={styles.line} />

        <Text style={styles.totalText}>
          Total Quantity .......... {calculateTotal()} kit
        </Text>
      </View>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    padding: 15,
  },

  /* HEADER REMOVED */

  /* TABS */
  tabs: {
    flexDirection: "row",
    marginTop: 10,
  },
  activeTab: {
    backgroundColor: "#1abc9c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  inactiveTab: {
    backgroundColor: "#d9d9d9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  tabTextInactive: { color: "#555", fontWeight: "600" },

  /* PRODUCT CARD */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 20,
    borderRadius: 15,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: "contain",
  },
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
  summary: { marginTop: 50, paddingHorizontal: 10 },
  summaryText: { fontSize: 16, marginBottom: 5 },
  line: { height: 1, backgroundColor: "#000", marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: "700" },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: "#1abc9c",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 25,
    marginBottom: 50,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
