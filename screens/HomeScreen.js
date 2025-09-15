import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, FlatList } from "react-native";

export default function HomeScreen() {
  const [therapy, setTherapy] = useState("");
  const [list, setList] = useState([]);

  const addTherapy = () => {
    if (!therapy.trim()) return;
    setList([...list, therapy]);
    setTherapy("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️‍♂️ Terapias</Text>

      <TextInput
        style={styles.input}
        placeholder="Añadir nueva terapia"
        value={therapy}
        onChangeText={setTherapy}
      />
      <Button title="Guardar" onPress={addTherapy} />

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

