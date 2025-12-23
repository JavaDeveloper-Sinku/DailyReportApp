"use client";


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";

type CapacityItem = {
  value: number;
  unit: "ML" | "L" | "G" | "KG" | "PCS";
  kits: number;
};

type ProductCardProps = {
  productName: string;
  capacities: CapacityItem[];
};

export default function ProductCard({
  productName,
  capacities,
}: ProductCardProps) {
  const [data, setData] = useState(capacities);
  const [editing, setEditing] = useState<number | null>(null);

  const handleChange = (index: number, value: number) => {
    if (value < 0) return;

    const updated = [...data];
    updated[index].kits = value;
    setData(updated);
  };

  const totalKits = data.reduce((sum, item) => sum + item.kits, 0);

  const formatCapacity = (v: number, u: string) =>
    `${v} ${u.toLowerCase()}`;

  return (
    <View style={styles.card}>
      {/* Product Name */}
      <Text style={styles.title}>{productName}</Text>

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Capacity</Text>
        <Text style={styles.headerText}>Kits</Text>
      </View>

      <View style={styles.divider} />

      {/* Rows */}
      {data.map((cap, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.capacity}>
            {formatCapacity(cap.value, cap.unit)}
          </Text>

          {editing === index ? (
            <TextInput
              value={String(cap.kits)}
              keyboardType="number-pad"
              autoFocus
              onChangeText={(v) =>
                handleChange(index, Number(v))
              }
              onBlur={() => setEditing(null)}
              style={styles.input}
            />
          ) : (
            <Pressable onPress={() => setEditing(index)}>
              <Text style={styles.kits}>{cap.kits}</Text>
            </Pressable>
          )}
        </View>
      ))}

      {/* Total Kits */}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total Kits</Text>
        <Text style={styles.totalValue}>{totalKits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  capacity: {
    fontSize: 14,
    color: "#555",
  },
  kits: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
    minWidth: 60,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
  },
});

