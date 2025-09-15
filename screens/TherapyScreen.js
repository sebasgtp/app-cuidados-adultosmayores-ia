// screens/TherapyScreen.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { baseStyles } from "../components/styles";

export default function TherapyScreen({ therapies = [], setTherapies, darkMode = false }) {
  const [text, setText] = useState("");
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";

  const addTherapy = () => {
    if (!text.trim()) return;
    setTherapies([...therapies, text.trim()]);
    setText("");
  };

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <View style={baseStyles.container}>
        <Text style={[baseStyles.title, { color: textColor }]}>Agregar terapia / visita</Text>

        <TextInput
          style={[baseStyles.input, { backgroundColor: darkMode ? "#0b2740" : "#fff", color: textColor }]}
          placeholder="Ej. Fisioterapia - 15 Sep 10:00"
          placeholderTextColor={darkMode ? "#9fb3c8" : "#999"}
          value={text}
          onChangeText={setText}
        />
        <Button title="Guardar" onPress={addTherapy} color={darkMode ? "#2E86AB" : undefined} />

        <Text style={[baseStyles.sectionTitle, { color: textColor, marginTop: 16 }]}>Tus sesiones</Text>
        <FlatList
          data={therapies}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => <Text style={{ color: textColor }}>• {item}</Text>}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}
