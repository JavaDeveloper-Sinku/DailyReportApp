import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function UserProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>Zoe Martin</Text>
          <Text style={styles.email}>ZeroMartin@gmail.com</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>

        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>+1 987 654 321</Text>

        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>California, USA</Text>

        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>Jan 2023</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

