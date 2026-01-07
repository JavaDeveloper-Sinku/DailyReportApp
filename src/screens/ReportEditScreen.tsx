"use client";

import React, { useState, useMemo } from "react";
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

type CapacityItem = {
  value: number;
  unit: "ML" | "L" | "G" | "KG" | "UNIT";
  kits: number;
};

type ProductState = {
  name: string;
  capacities: CapacityItem[];
};

const TestScreen: React.FC = () => {
  const [products, setProducts] = useState<ProductState[]>([
    {
      name: "Hand Sanitizer",
      capacities: [
        { value: 100, unit: "ML", kits: 5 },
        { value: 20, unit: "ML", kits: 12 },
        { value: 500, unit: "ML", kits: 3 },
        { value: 10, unit: "ML", kits: 2 },
      ],
    },
    {
      name: "Rice Bag",
      capacities: [
        { value: 1, unit: "KG", kits: 10 },
        { value: 5, unit: "KG", kits: 4 },
      ],
    },
  ]);

  // 🔥 Central update handler
  const updateCapacities = (index: number, updatedCaps: CapacityItem[]) => {
    const updatedProducts = [...products];
    updatedProducts[index].capacities = updatedCaps;
    setProducts(updatedProducts);
  };

  // 🔢 Total kits (ALL PRODUCTS)
  const totalQuantity = useMemo(() => {
    return products.reduce((sum, p) => {
      return (
        sum +
        p.capacities.reduce((capSum, c) => capSum + c.kits, 0)
      );
    }, 0);
  }, [products]);

  const handleSave = () => {
    console.log("FINAL DATA:", products);
    Alert.alert("Saved", "Report saved successfully");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.total}>Total Quantity: {totalQuantity}</Text>

        {products.map((product, index) => (
          <ProductCard
            key={product.name}
            productName={product.name}
            capacities={product.capacities}
            onChange={(updated) => updateCapacities(index, updated)}
          />
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TestScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  btn: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 