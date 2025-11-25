import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Image 
          source={{ uri: "https://i.imgur.com/L7pJ5vQ.png" }} 
          style={styles.logo}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* ===== GREETINGS ===== */}
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Here is your daily overview</Text>

      {/* ===== STATS CARDS ===== */}
      <View style={styles.statsContainer}>
        
        <View style={styles.card}>
          <Text style={styles.cardNumber}>12</Text>
          <Text style={styles.cardLabel}>Products</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>₹540</Text>
          <Text style={styles.cardLabel}>Today’s Sale</Text>
        </View>

      </View>

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>08</Text>
          <Text style={styles.cardLabel}>Items Used</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>4</Text>
          <Text style={styles.cardLabel}>Pending Tasks</Text>
        </View>
      </View>

      {/* ===== ACTION BUTTONS ===== */}
      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => navigation.navigate('Report' as never)}
      >
        <Text style={styles.mainButtonText}>➕ Add Today’s Report</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Notification' as never)}
      >
        <Text style={styles.secondaryButtonText}>🔔 View Notifications</Text>
      </TouchableOpacity>

  
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Test' as never)}
      >
        <Text style={styles.secondaryButtonText}>🧪 Test Screen</Text>
      </TouchableOpacity>

      
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('ReportList' as never)}
      >
        <Text style={styles.secondaryButtonText}>📋 Report List</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('ReportEdit' as never)}
      >
        <Text style={styles.secondaryButtonText}>📋 Report edit screen</Text>
      </TouchableOpacity>

      

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 10,
    backgroundColor: '#F6F7FB',
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },

  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },

  /* TEXT */
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  /* STATS CARDS */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
  },

  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  /* BUTTONS */
  mainButton: {
    marginTop: 20,
    backgroundColor: "#4A6CF7",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },

  mainButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  secondaryButton: {
    marginTop: 12,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },

  secondaryButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
