// screens/ReminderScreen.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { baseStyles } from "../components/styles";

export default function ReminderScreen({ reminders = [], setReminders, darkMode = false }) {
  const [text, setText] = useState("");
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";

  const addReminder = () => {
    if (!text.trim()) return;
    setReminders([...reminders, text.trim()]);
    setText("");
  };

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <View style={baseStyles.container}>
        <Text style={[baseStyles.title, { color: textColor }]}>Agregar recordatorio</Text>

        <TextInput
          style={[baseStyles.input, { backgroundColor: darkMode ? "#0b2740" : "#fff", color: textColor }]}
          placeholder="Ej. Tomar medicamento a las 8:00"
          placeholderTextColor={darkMode ? "#9fb3c8" : "#999"}
          value={text}
          onChangeText={setText}
        />
        <Button title="Guardar" onPress={addReminder} color={darkMode ? "#2E86AB" : undefined} />

        <Text style={[baseStyles.sectionTitle, { color: textColor, marginTop: 16 }]}>Tus recordatorios</Text>
        <FlatList
          data={reminders}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => <Text style={{ color: textColor }}>• {item}</Text>}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}
