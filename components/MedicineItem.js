import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MedicineItem = ({ name }) => (
  <View style={styles.container}>
    <Text>{name}</Text>
  </View>
);

export default MedicineItem;

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff", marginBottom: 5, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
});
