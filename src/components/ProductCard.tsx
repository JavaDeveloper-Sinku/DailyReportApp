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
  id: string;
  value: number;
  unit: "ML" | "L" | "G" | "KG" | "UNIT" | "PCS";
  kits: number;
};

type ProductCardProps = {
  productName: string;
  capacities: CapacityItem[];
  onChange: (updatedCapacities: CapacityItem[]) => void;
};

export default function ProductCard({
  productName,
  capacities,
  onChange,
}: ProductCardProps) {
  const [editing, setEditing] = useState<string | null>(null);

  const handleChange = (id: string, value: number) => {
    if (isNaN(value) || value < 0) return;

    const updated = capacities.map((item) =>
      item.id === id ? { ...item, kits: value } : item
    );

    onChange(updated); // ✅ single source of truth
  };

  const totalKits = capacities.reduce((sum, item) => sum + item.kits, 0);

  const formatCapacity = (v: number, u: string) =>
    `${v} ${u.toLowerCase()}`;


  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{productName}</Text>

      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Capacity</Text>
        <Text style={styles.headerText}>Kits</Text>
      </View>

      <View style={styles.divider} />

      {capacities.map((cap) => (
        <View key={cap.id} style={styles.row}>
          <Text style={styles.capacity}>
            {formatCapacity(cap.value, cap.unit)}
          </Text>

          {editing === cap.id ? (
            <TextInput
              value={String(cap.kits)}
              keyboardType="number-pad"
              autoFocus
              onChangeText={(v) => handleChange(cap.id, Number(v))}
              onBlur={() => setEditing(null)}
              style={styles.input}
            />
          ) : (
            <Pressable onPress={() => setEditing(cap.id)}>
              <Text style={styles.kits}>{cap.kits}</Text>
            </Pressable>
          )}
        </View>
      ))}

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
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  capacity: {
    fontSize: 16,
    color: "#333",
  },
  kits: {
    fontSize: 16,
    color: "#007BFF",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#007BFF",
    fontSize: 16,
    color: "#333",
    minWidth: 40,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});