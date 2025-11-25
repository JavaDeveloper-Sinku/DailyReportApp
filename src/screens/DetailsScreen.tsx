import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details Screen</Text>

      <Button 
        title="Go Back" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
  },
});
