import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen() {
  const notifications = [
    { id: 1, title: "New Report Added", date: "24 Nov 2025" },
    { id: 2, title: "Stock Updated Successfully", date: "23 Nov 2025" },
    { id: 3, title: "New User Logged In", date: "22 Nov 2025" },
    { id: 4, title: "Backup Completed", date: "20 Nov 2025" },
    { id: 5, title: "Old Reports Archived", date: "19 Nov 2025" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>
        <Ionicons name="notifications-outline" size={28} color="#333" />
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.dot}>●</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  date: {
    fontSize: 13,
    color: "gray",
    marginTop: 5,
  },

  dot: {
    fontSize: 20,
    color: "#2E8B57",
  },
});
