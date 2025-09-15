import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList } from "react-native";

export default function HealthScreen() {
  const [med, setMed] = useState("");
  const [list, setList] = useState([]);

  const addMed = () => {
    if (!med.trim()) return;
    setList([...list, med]);
    setMed("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💊 Salud</Text>

      <TextInput
        style={styles.input}
        placeholder="Añadir medicamento"
        value={med}
        onChangeText={setMed}
      />
      <Button title="Guardar" onPress={addMed} />

      <FlatList
        data={list}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <Text>• {item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
});
