import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReminderItem = ({ text }) => (
  <View style={styles.container}>
    <Text>{text}</Text>
  </View>
);

export default ReminderItem;

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#fff", marginBottom: 5, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
});
