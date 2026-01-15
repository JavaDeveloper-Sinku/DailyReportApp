"use client";

import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

const TestScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* ===== HEADER BOX ===== */}
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>TestScreen Header</Text>
      </View>

      {/* ===== BODY ===== */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>TestScreen</Text>
      </View>

    </SafeAreaView>
  );
};

export default TestScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  headerBox: {
    
    backgroundColor: "#1ede10",
    margin: 20,
    padding: 16,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },

  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bodyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563eb",
  },
});
