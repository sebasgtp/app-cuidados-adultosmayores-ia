// screens/DashboardScreen.js
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { baseStyles } from "../components/styles";

export default function DashboardScreen({ reminders = [], medications = [], therapies = [], darkMode = false }) {
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#ffffff" : "#111";

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={{ paddingTop: 8 }}>
        <Text style={[baseStyles.title, { color: textColor }]}>Resumen</Text>

        <View style={baseStyles.section}>
          <Text style={[baseStyles.sectionTitle, { color: textColor }]}>Recordatorios</Text>
          {reminders.length === 0 ? <Text style={{ color: textColor }}>No hay recordatorios</Text> :
            reminders.map((r, i) => <Text key={i} style={{ color: textColor }}>• {r}</Text>)
          }
        </View>

        <View style={baseStyles.section}>
          <Text style={[baseStyles.sectionTitle, { color: textColor }]}>Medicamentos</Text>
          {medications.length === 0 ? <Text style={{ color: textColor }}>No hay medicamentos</Text> :
            medications.map((m, i) => <Text key={i} style={{ color: textColor }}>• {m}</Text>)
          }
        </View>

        <View style={baseStyles.section}>
          <Text style={[baseStyles.sectionTitle, { color: textColor }]}>Terapias / Visitas</Text>
          {therapies.length === 0 ? <Text style={{ color: textColor }}>No hay sesiones</Text> :
            therapies.map((t, i) => <Text key={i} style={{ color: textColor }}>• {t}</Text>)
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
