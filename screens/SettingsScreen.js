// screens/SettingsScreen.js
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Switch } from "react-native";
import { baseStyles } from "../components/styles";

export default function SettingsScreen({ darkMode, setDarkMode }) {
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <View style={baseStyles.container}>
        <Text style={[baseStyles.title, { color: textColor }]}>Ajustes</Text>

        <View style={baseStyles.section}>
          <Text style={{ color: textColor, marginBottom: 8 }}>Modo oscuro (azul)</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>
    </SafeAreaView>
  );
}
