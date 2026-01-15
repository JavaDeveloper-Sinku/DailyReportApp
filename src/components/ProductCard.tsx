"use client";

import { Video } from "lucide-react-native";
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

    onChange(updated);
  };

  const totalKits = capacities.reduce((sum, item) => sum + item.kits, 0);

  const formatCapacity = (v: number, u: string) =>
    `${v} ${u}`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{productName}</Text>

      {capacities.map((cap) => (
        <View key={cap.id} style={styles.row}>
          {/* ===== Capacity Box ===== */}
          <View style={styles.box}>
            <Text style={styles.boxLabel}>Capacity</Text>
            <Text style={styles.boxValue}>
              {formatCapacity(cap.value, cap.unit)}
            </Text>
          </View>

          {/* ===== Kits Box ===== */}
          <View style={styles.box}>
            <Text style={styles.boxLabel}>Kits</Text>

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
                <Text style={styles.boxValue}>{cap.kits}</Text>
              </Pressable>
            )}
          </View>
        </View>
      ))}

      {/* ===== Total Box ===== */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total Kits</Text>
        <Text style={styles.totalValue}>{totalKits}</Text>
      </View>





     
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  box: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    alignItems: "center",
  },

  boxLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },

  boxValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  input: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
    textAlign: "center",
    minWidth: 40,
  },

  totalBox: {
    marginTop: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 13,
    color: "#4f46e5",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4338ca",
  },
});
