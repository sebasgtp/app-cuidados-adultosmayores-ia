// App.js 
import React, { useState, useEffect } from "react";
import { 
  SafeAreaProvider 
} from "react-native-safe-area-context";
import { 
  NavigationContainer, 
  DefaultTheme, 
  DarkTheme 
} from "@react-navigation/native";
import { 
  createBottomTabNavigator 
} from "@react-navigation/bottom-tabs";
import { 
  Ionicons 
} from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Animated,
  StatusBar
} from "react-native";

import DashboardScreen from "./screens/DashboardScreen";
import RemindersScreen from "./screens/RemindersScreen";
import MedicationScreen from "./screens/MedicationScreen";
import TherapyScreen from "./screens/TherapyScreen";
import ChatScreen from "./screens/ChatScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  // Estados originales MANTENIDOS
  const [darkMode, setDarkMode] = useState(false);
  
  // Estado global compartido ORIGINAL
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [therapies, setTherapies] = useState([]);

  // Estados nuevos AGREGADOS (no modifican original)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [tabAnimation] = useState(new Animated.Value(1));

  const theme = darkMode ? DarkTheme : DefaultTheme;

  // Tema personalizado mejorado AGREGADO
  const enhancedTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#007AFF',
      background: darkMode ? '#071B2E' : '#f8f9fa',
      card: darkMode ? '#1E3A5F' : '#ffffff',
      text: darkMode ? '#ffffff' : '#111111',
      border: darkMode ? '#2A4A6B' : '#e1e1e1',
      notification: '#FF3333',
    }
  };

  // Función para manejar emergencia AGREGADA
  const handleEmergencyCall = () => {
    setShowEmergencyModal(true);
    // Animación de pulso
    Animated.sequence([
      Animated.timing(tabAnimation, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const confirmEmergencyCall = () => {
    setShowEmergencyModal(false);
    const emergencyNumber = '911'; // Cambiar a '123' para Colombia
    
    Alert.alert(
      "🚨 Llamando a Emergencias",
      `Conectando con ${emergencyNumber}...\n\nEste es el servicio de emergencias médicas.`,
      [
        { 
          text: "Cancelar", 
          style: "cancel",
          onPress: () => console.log("Llamada de emergencia cancelada")
        },
        {
          text: "Llamar Ahora",
          onPress: () => {
            Linking.openURL(`tel:${emergencyNumber}`).catch(() => {
              Alert.alert("Error", "No se pudo realizar la llamada de emergencia");
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  // Función para contar notificaciones AGREGADA
  useEffect(() => {
    const totalItems = reminders.length + medications.length + therapies.length;
    const today = new Date().toISOString().split('T')[0];
    
    // Contar elementos de hoy
    const todayItems = [
      ...reminders.filter(item => item.date === today),
      ...medications.filter(item => item.nextDose === today),
      ...therapies.filter(item => item.date === today)
    ].length;

    setUnreadCount(todayItems);
    setShowNotificationBadge(todayItems > 0);
  }, [reminders, medications, therapies]);

  // Componente de TabBar personalizado AGREGADO
  const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
      <View style={[
        enhancedStyles.tabBarContainer, 
        { backgroundColor: enhancedTheme.colors.card }
      ]}>
        {/* Línea superior decorativa */}
        <View style={[
          enhancedStyles.tabBarTopLine, 
          { backgroundColor: enhancedTheme.colors.primary }
        ]} />
        
        <View style={enhancedStyles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            // Obtener ícono personalizado
            let iconName = "help-circle-outline";
            const name = route.name.toLowerCase();
            if (name.includes("dash") || name.includes("dashboard")) iconName = "grid-outline";
            else if (name.includes("therap") || name.includes("terap")) iconName = "fitness-outline";
            else if (name.includes("remind") || name.includes("record")) iconName = "calendar-outline";
            else if (name.includes("chat")) iconName = "chatbubble-ellipses-outline";
            else if (name.includes("medic") || name.includes("salud")) iconName = "medkit-outline";
            else if (name.includes("set") || name.includes("ajust")) iconName = "settings-outline";

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  enhancedStyles.tabItem,
                  isFocused && enhancedStyles.tabItemFocused
                ]}
              >
                <View style={enhancedStyles.tabIconContainer}>
                  <Ionicons 
                    name={iconName} 
                    size={24} 
                    color={isFocused ? enhancedTheme.colors.primary : '#999999'} 
                  />
                  
                  {/* Badge de notificación solo en Dashboard */}
                  {route.name === 'Dashboard' && showNotificationBadge && (
                    <View style={enhancedStyles.notificationBadge}>
                      <Text style={enhancedStyles.notificationText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}

                  {/* Indicador circular activo */}
                  {isFocused && (
                    <View style={[
                      enhancedStyles.circularActiveIndicator,
                      { backgroundColor: enhancedTheme.colors.primary }
                    ]} />
                  )}
                </View>
                
                {/* LABELS REMOVIDOS - Solo quedan íconos */}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Modal de emergencia AGREGADO
  const EmergencyModal = () => (
    <Modal
      visible={showEmergencyModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowEmergencyModal(false)}
    >
      <View style={enhancedStyles.emergencyOverlay}>
        <Animated.View style={[
          enhancedStyles.emergencyModal,
          { 
            backgroundColor: enhancedTheme.colors.card,
            transform: [{ scale: tabAnimation }]
          }
        ]}>
          <View style={enhancedStyles.emergencyIcon}>
            <Text style={enhancedStyles.emergencyIconText}>🚨</Text>
          </View>
          
          <Text style={[enhancedStyles.emergencyTitle, { color: enhancedTheme.colors.text }]}>
            Llamada de Emergencia
          </Text>
          
          <Text style={[enhancedStyles.emergencyMessage, { color: enhancedTheme.colors.text, opacity: 0.8 }]}>
            ¿Necesitas asistencia médica de emergencia inmediata?
          </Text>
          
          <View style={enhancedStyles.emergencyInfo}>
            <Text style={[enhancedStyles.emergencyInfoText, { color: enhancedTheme.colors.text, opacity: 0.7 }]}>
              🏥 Servicios médicos de emergencia
            </Text>
            <Text style={[enhancedStyles.emergencyInfoText, { color: enhancedTheme.colors.text, opacity: 0.7 }]}>
              📞 Línea disponible 24/7
            </Text>
            <Text style={[enhancedStyles.emergencyInfoText, { color: enhancedTheme.colors.text, opacity: 0.7 }]}>
              ⚡ Respuesta inmediata
            </Text>
          </View>
          
          <View style={enhancedStyles.emergencyButtons}>
            <TouchableOpacity 
              style={[enhancedStyles.emergencyButton, enhancedStyles.cancelButton]}
              onPress={() => setShowEmergencyModal(false)}
            >
              <Text style={enhancedStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[enhancedStyles.emergencyButton, enhancedStyles.callButton]}
              onPress={confirmEmergencyCall}
            >
              <Text style={enhancedStyles.callButtonText}>🚨 Llamar 911</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[enhancedStyles.emergencyNote, { color: enhancedTheme.colors.text, opacity: 0.6 }]}>
            Solo para emergencias médicas reales
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );

  // ESTRUCTURA ORIGINAL MANTENIDA
  return (
    <SafeAreaProvider>
      {/* StatusBar mejorado AGREGADO */}
      <StatusBar 
        backgroundColor={darkMode ? '#071B2E' : '#f8f9fa'} 
        barStyle={darkMode ? 'light-content' : 'dark-content'}
      />
      
      <NavigationContainer theme={enhancedTheme}>
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
            tabBarActiveTintColor: "#007AFF", // Cambiado a azul de la identidad
            tabBarInactiveTintColor: "gray",
          })}
          tabBar={props => <CustomTabBar {...props} />}
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

        {/* Modal de emergencia AGREGADO */}
        <EmergencyModal />

        {/* Botón de emergencia flotante global AGREGADO - Lado izquierdo */}
        <TouchableOpacity 
          style={[
            enhancedStyles.globalEmergencyFab,
            { backgroundColor: '#FF3333' }
          ]}
          onPress={handleEmergencyCall}
        >
          <Text style={enhancedStyles.emergencyFabIcon}>🚨</Text>
          <Text style={enhancedStyles.emergencyFabText}>SOS</Text>
        </TouchableOpacity>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Estilos nuevos AGREGADOS (no modifican original)
const enhancedStyles = StyleSheet.create({
  // TabBar personalizado
  tabBarContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopWidth: 0,
  },
  tabBarTopLine: {
    height: 3,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingBottom: 20, // Para safe area
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabItemFocused: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Indicador circular activo (reemplaza la línea)
  circularActiveIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    elevation: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  // Badge de notificación
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3333',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Botón de emergencia global - Lado izquierdo
  globalEmergencyFab: {
    position: 'absolute',
    bottom: 100, // Encima del tab bar
    left: 20, // Cambiado a la izquierda
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    zIndex: 1000,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  emergencyFabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  emergencyFabText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Modal de emergencia
  emergencyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,51,51,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  emergencyModal: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  emergencyIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emergencyIconText: {
    fontSize: 42,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyMessage: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  emergencyInfo: {
    marginBottom: 28,
    alignItems: 'center',
  },
  emergencyInfoText: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  emergencyButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emergencyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelButton: {
    backgroundColor: '#999999',
  },
  callButton: {
    backgroundColor: '#FF3333',
    elevation: 6,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});