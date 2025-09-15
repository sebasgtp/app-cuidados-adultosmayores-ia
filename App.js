// App.js
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "./screens/DashboardScreen";
import RemindersScreen from "./screens/RemindersScreen";
import MedicationScreen from "./screens/MedicationScreen";
import TherapyScreen from "./screens/TherapyScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Estado global compartido
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [therapies, setTherapies] = useState([]);

  const theme = darkMode ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color, size }) => {
              let iconName = "help-circle-outline";
              // soporta nombres ingles/español (por si cambias)
              const name = route.name.toLowerCase();
              if (name.includes("dash") || name.includes("dashboard")) iconName = "grid-outline";
              else if (name.includes("therap") || name.includes("terap")) iconName = "fitness-outline";
              else if (name.includes("remind") || name.includes("record")) iconName = "calendar-outline";
              else if (name.includes("chat")) iconName = "chatbubble-ellipses-outline";
              else if (name.includes("medic") || name.includes("salud")) iconName = "medkit-outline";
              else if (name.includes("set") || name.includes("ajust")) iconName = "settings-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#2E86AB",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Dashboard">
            {() => (
              <DashboardScreen
                reminders={reminders}
                medications={medications}
                therapies={therapies}
                darkMode={darkMode}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Recordatorios">
            {() => <RemindersScreen reminders={reminders} setReminders={setReminders} darkMode={darkMode} />}
          </Tab.Screen>

          <Tab.Screen name="Medicamentos">
            {() => <MedicationScreen medications={medications} setMedications={setMedications} darkMode={darkMode} />}
          </Tab.Screen>

          <Tab.Screen name="Terapias">
            {() => <TherapyScreen therapies={therapies} setTherapies={setTherapies} darkMode={darkMode} />}
          </Tab.Screen>

          <Tab.Screen name="Chat">
            {() => <ChatScreen darkMode={darkMode} />}
          </Tab.Screen>

          <Tab.Screen name="Ajustes">
            {() => <SettingsScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
