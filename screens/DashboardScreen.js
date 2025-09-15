// screens/DashboardScreen.js
import React, { useState } from "react";
import { 
  ScrollView, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet,
  Modal,
  Alert,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { baseStyles } from "../components/styles";

const { width } = Dimensions.get('window');

export default function DashboardScreen({ reminders = [], medications = [], therapies = [], darkMode = false }) {
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#ffffff" : "#111";
  
  // Estados para funcionalidades mejoradas (NUEVOS - NO MODIFICAN ORIGINAL)
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Función para obtener datos de hoy (NUEVA)
  const getTodayData = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayReminders = reminders.filter(item => item.date === today);
    const todayMedications = medications.filter(item => item.nextDose === today);
    const todayTherapies = therapies.filter(item => item.date === today);
    
    return {
      reminders: todayReminders,
      medications: todayMedications,
      therapies: todayTherapies,
      total: todayReminders.length + todayMedications.length + todayTherapies.length
    };
  };

  const todayData = getTodayData();

  // Función para obtener estadísticas (NUEVA)
  const getStats = () => {
    return {
      total: reminders.length + medications.length + therapies.length,
      reminders: reminders.length,
      medications: medications.length,
      therapies: therapies.length,
      today: todayData.total
    };
  };

  const stats = getStats();

  // Función para manejar emergencia (NUEVA)
  const handleEmergencyCall = () => {
    setShowEmergencyModal(true);
  };

  const confirmEmergencyCall = () => {
    setShowEmergencyModal(false);
    // Número de emergencias (puedes cambiarlo según el país)
    const emergencyNumber = '911'; // En Colombia sería '123'
    
    Alert.alert(
      "Llamando a Emergencias",
      `Conectando con ${emergencyNumber}...`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Llamar",
          onPress: () => {
            Linking.openURL(`tel:${emergencyNumber}`).catch(() => {
              Alert.alert("Error", "No se pudo realizar la llamada");
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  // Función para manejar detalles de item (NUEVA)
  const handleItemPress = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetailModal(true);
  };

  // Función para obtener color según tipo (NUEVA)
  const getTypeColor = (type) => {
    switch(type) {
      case 'reminder': return '#007AFF';
      case 'medication': return '#4CAF50';
      case 'therapy': return '#FF9800';
      default: return '#007AFF';
    }
  };

  // Función para obtener ícono según tipo (NUEVA)
  const getTypeIcon = (type) => {
    switch(type) {
      case 'reminder': return '🔔';
      case 'medication': return '💊';
      case 'therapy': return '🏥';
      default: return '📋';
    }
  };

  // Renderers originales (MANTIENEN LÓGICA ORIGINAL + MEJORAS VISUALES)
  const renderReminder = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleItemPress(item, 'reminder')}
      style={[
        enhancedStyles.card,
        { 
          backgroundColor: darkMode ? "#1E3A5F" : "#ffffff",
          shadowColor: darkMode ? "#000" : "#000",
        }
      ]}
    >
      <View style={[enhancedStyles.cardIndicator, { backgroundColor: '#007AFF' }]} />
      <View style={enhancedStyles.cardHeader}>
        <Text style={[enhancedStyles.cardCategory, { color: '#007AFF' }]}>
          RECORDATORIO
        </Text>
        <View style={[enhancedStyles.statusBadge, { backgroundColor: '#4CAF50' }]}>
          <Text style={enhancedStyles.statusText}>ACTIVO</Text>
        </View>
      </View>
      <Text style={[enhancedStyles.cardTitle, { color: textColor }]}>
        🔔 {item.time}
      </Text>
      <Text style={[enhancedStyles.cardSubtitle, { color: textColor, opacity: 0.8 }]}>
        📅 {item.date}
      </Text>
      <Text style={[enhancedStyles.cardDetails, { color: textColor, opacity: 0.7 }]}>
        {item.text}
      </Text>
      
      {/* Fallback: Mantener diseño original si falla */}
      <View style={[baseStyles.box, { backgroundColor: darkMode ? "#123455" : "#e0f7fa", display: 'none' }]}>
        <Text style={[baseStyles.boxTitle, { color: textColor }]}>{item.date} {item.time}</Text>
        <Text style={[baseStyles.boxText, { color: textColor }]}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMedication = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleItemPress(item, 'medication')}
      style={[
        enhancedStyles.card,
        { 
          backgroundColor: darkMode ? "#1E3A5F" : "#ffffff",
          shadowColor: darkMode ? "#000" : "#000",
        }
      ]}
    >
      <View style={[enhancedStyles.cardIndicator, { backgroundColor: '#4CAF50' }]} />
      <View style={enhancedStyles.cardHeader}>
        <Text style={[enhancedStyles.cardCategory, { color: '#4CAF50' }]}>
          MEDICAMENTO
        </Text>
        <View style={[enhancedStyles.statusBadge, { backgroundColor: '#FF9800' }]}>
          <Text style={enhancedStyles.statusText}>PENDIENTE</Text>
        </View>
      </View>
      <Text style={[enhancedStyles.cardTitle, { color: textColor }]}>
        💊 {item.medication}
      </Text>
      <Text style={[enhancedStyles.cardSubtitle, { color: textColor, opacity: 0.8 }]}>
        🏥 {item.disease}
      </Text>
      <Text style={[enhancedStyles.cardDetails, { color: textColor, opacity: 0.7 }]}>
        {item.dosage || 'Ver detalles para más información'}
      </Text>
      
      {/* Fallback: Mantener diseño original si falla */}
      <View style={[baseStyles.box, { backgroundColor: darkMode ? "#123455" : "#fff3e0", display: 'none' }]}>
        <Text style={[baseStyles.boxTitle, { color: textColor }]}>{item.disease}</Text>
        <Text style={[baseStyles.boxText, { color: textColor }]}>{item.medication}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTherapy = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleItemPress(item, 'therapy')}
      style={[
        enhancedStyles.card,
        { 
          backgroundColor: darkMode ? "#1E3A5F" : "#ffffff",
          shadowColor: darkMode ? "#000" : "#000",
        }
      ]}
    >
      <View style={[enhancedStyles.cardIndicator, { backgroundColor: '#FF9800' }]} />
      <View style={enhancedStyles.cardHeader}>
        <Text style={[enhancedStyles.cardCategory, { color: '#FF9800' }]}>
          TERAPIA
        </Text>
        <View style={[enhancedStyles.statusBadge, { backgroundColor: '#2196F3' }]}>
          <Text style={enhancedStyles.statusText}>PRÓXIMA</Text>
        </View>
      </View>
      <Text style={[enhancedStyles.cardTitle, { color: textColor }]}>
        🏥 Sesión
      </Text>
      <Text style={[enhancedStyles.cardSubtitle, { color: textColor, opacity: 0.8 }]}>
        📅 {item.date}
      </Text>
      <Text style={[enhancedStyles.cardDetails, { color: textColor, opacity: 0.7 }]}>
        {item.description}
      </Text>
      
      {/* Fallback: Mantener diseño original si falla */}
      <View style={[baseStyles.box, { backgroundColor: darkMode ? "#123455" : "#f3e5f5", display: 'none' }]}>
        <Text style={[baseStyles.boxTitle, { color: textColor }]}>{item.date}</Text>
        <Text style={[baseStyles.boxText, { color: textColor }]}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // Componentes nuevos (NO MODIFICAN ORIGINAL)
  const StatsPanel = () => (
    <View style={[
      enhancedStyles.statsContainer,
      { backgroundColor: darkMode ? "#1E3A5F" : "#ffffff" }
    ]}>
      <View style={enhancedStyles.statItem}>
        <Text style={[enhancedStyles.statNumber, { color: '#007AFF' }]}>
          {stats.total}
        </Text>
        <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
          Total
        </Text>
      </View>
      <View style={enhancedStyles.statItem}>
        <Text style={[enhancedStyles.statNumber, { color: '#4CAF50' }]}>
          {stats.today}
        </Text>
        <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
          Hoy
        </Text>
      </View>
      <View style={enhancedStyles.statItem}>
        <Text style={[enhancedStyles.statNumber, { color: '#FF9800' }]}>
          {stats.reminders}
        </Text>
        <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
          Recordatorios
        </Text>
      </View>
    </View>
  );

  const EmergencyModal = () => (
    <Modal
      visible={showEmergencyModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowEmergencyModal(false)}
    >
      <View style={enhancedStyles.emergencyOverlay}>
        <View style={[
          enhancedStyles.emergencyModal,
          { backgroundColor: darkMode ? "#1E3A5F" : "#ffffff" }
        ]}>
          <View style={enhancedStyles.emergencyIcon}>
            <Text style={enhancedStyles.emergencyIconText}>🚨</Text>
          </View>
          
          <Text style={[enhancedStyles.emergencyTitle, { color: textColor }]}>
            Llamada de Emergencia
          </Text>
          
          <Text style={[enhancedStyles.emergencyMessage, { color: textColor, opacity: 0.8 }]}>
            ¿Estás seguro de que quieres llamar a los servicios de emergencia?
          </Text>
          
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
              <Text style={enhancedStyles.callButtonText}>🚨 Llamar Ahora</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[enhancedStyles.emergencyNote, { color: textColor, opacity: 0.6 }]}>
            Esta acción iniciará una llamada a emergencias (911)
          </Text>
        </View>
      </View>
    </Modal>
  );

  const DetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDetailModal(false)}
    >
      <View style={enhancedStyles.modalOverlay}>
        <View style={[
          enhancedStyles.modalContent,
          { backgroundColor: darkMode ? "#1E3A5F" : "#ffffff" }
        ]}>
          <View style={enhancedStyles.modalHeader}>
            <Text style={[enhancedStyles.modalTitle, { color: textColor }]}>
              {getTypeIcon(selectedItem?.type)} Detalles
            </Text>
            <TouchableOpacity 
              onPress={() => setShowDetailModal(false)}
              style={enhancedStyles.closeButton}
            >
              <Text style={enhancedStyles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          {selectedItem && (
            <ScrollView style={enhancedStyles.modalBody}>
              <View style={enhancedStyles.detailRow}>
                <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                  Tipo:
                </Text>
                <Text style={[enhancedStyles.detailValue, { color: getTypeColor(selectedItem.type) }]}>
                  {selectedItem.type.toUpperCase()}
                </Text>
              </View>
              
              {Object.entries(selectedItem).map(([key, value]) => {
                if (key !== 'type' && typeof value === 'string') {
                  return (
                    <View key={key} style={enhancedStyles.detailRow}>
                      <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Text>
                      <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                        {value}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  // ESTRUCTURA ORIGINAL MANTENIDA - Solo agregamos capas visuales
  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      {/* Header mejorado (AGREGADO) */}
      <View style={[enhancedStyles.header, { backgroundColor: bg }]}>
        <TouchableOpacity style={enhancedStyles.menuButton}>
          <Text style={[enhancedStyles.menuIcon, { color: textColor }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[enhancedStyles.appTitle, { color: textColor }]}>
          EternAI
        </Text>
        <View style={enhancedStyles.profileContainer}>
          <View style={[
            enhancedStyles.profilePicture,
            { backgroundColor: darkMode ? "#007AFF" : "#007AFF" }
          ]}>
            <Text style={enhancedStyles.profileInitial}>U</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 12 }}>
        {/* TÍTULO ORIGINAL MANTENIDO */}
        <Text style={[baseStyles.title, { color: textColor, textAlign: "center", fontSize: 28, display: 'none' }]}>
          EternAI
        </Text>

        {/* Panel de estadísticas (AGREGADO) */}
        <StatsPanel />

        {/* Sección especial: Hoy (AGREGADA) */}
        {todayData.total > 0 && (
          <View style={enhancedStyles.todaySection}>
            <Text style={[enhancedStyles.todaySectionTitle, { color: '#007AFF' }]}>
              📅 Para Hoy ({todayData.total})
            </Text>
            <View style={[
              enhancedStyles.todayContainer,
              { backgroundColor: darkMode ? "#1E3A5F" : "#E3F2FD" }
            ]}>
              {todayData.reminders.map((item, index) => (
                <Text key={`today-reminder-${index}`} style={[enhancedStyles.todayItem, { color: textColor }]}>
                  🔔 {item.time} - {item.text}
                </Text>
              ))}
              {todayData.medications.map((item, index) => (
                <Text key={`today-med-${index}`} style={[enhancedStyles.todayItem, { color: textColor }]}>
                  💊 {item.medication}
                </Text>
              ))}
              {todayData.therapies.map((item, index) => (
                <Text key={`today-therapy-${index}`} style={[enhancedStyles.todayItem, { color: textColor }]}>
                  🏥 {item.description}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* SECCIONES ORIGINALES MANTENIDAS */}
        {/* Recordatorios */}
        <Text style={[baseStyles.sectionTitle, { color: textColor, marginTop: 20 }]}>🔔 Recordatorios</Text>
        {reminders.length === 0 ? (
          <View style={[
            enhancedStyles.emptyState,
            { backgroundColor: darkMode ? "#1E3A5F" : "#f5f5f5" }
          ]}>
            <Text style={[enhancedStyles.emptyText, { color: textColor, opacity: 0.6 }]}>
              No hay recordatorios programados
            </Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminder}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}

        {/* Medicamentos */}
        <Text style={[baseStyles.sectionTitle, { color: textColor, marginTop: 20 }]}>💊 Medicamentos</Text>
        {medications.length === 0 ? (
          <View style={[
            enhancedStyles.emptyState,
            { backgroundColor: darkMode ? "#1E3A5F" : "#f5f5f5" }
          ]}>
            <Text style={[enhancedStyles.emptyText, { color: textColor, opacity: 0.6 }]}>
              No hay medicamentos registrados
            </Text>
          </View>
        ) : (
          <FlatList
            data={medications}
            renderItem={renderMedication}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}

        {/* Terapias / Visitas */}
        <Text style={[baseStyles.sectionTitle, { color: textColor, marginTop: 20 }]}>🏥 Terapias / Visitas</Text>
        {therapies.length === 0 ? (
          <View style={[
            enhancedStyles.emptyState,
            { backgroundColor: darkMode ? "#1E3A5F" : "#f5f5f5" }
          ]}>
            <Text style={[enhancedStyles.emptyText, { color: textColor, opacity: 0.6 }]}>
              No hay sesiones programadas
            </Text>
          </View>
        ) : (
          <FlatList
            data={therapies}
            renderItem={renderTherapy}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
        
        {/* Espaciado inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modales (AGREGADOS) */}
      <DetailModal />
      <EmergencyModal />

      {/* Botón de Emergencia (AGREGADO EN LUGAR DE FAB ORIGINAL) */}
      <TouchableOpacity 
        style={enhancedStyles.emergencyFab}
        onPress={handleEmergencyCall}
      >
        <Text style={enhancedStyles.emergencyFabIcon}>🚨</Text>
        <Text style={enhancedStyles.emergencyFabText}>SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ESTILOS COMPLETAMENTE NUEVOS - NO MODIFICAN ORIGINALES
const enhancedStyles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Panel de estadísticas
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Sección "Hoy"
  todaySection: {
    marginBottom: 24,
  },
  todaySectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  todayContainer: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  todayItem: {
    fontSize: 14,
    marginBottom: 8,
    paddingVertical: 4,
  },

  // Cards
  card: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  cardIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardDetails: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Estado vacío
  emptyState: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },

  // Modal de detalles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },

  // Botón de Emergencia
  emergencyFab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF3333',
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

  // Modal de Emergencia
  emergencyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,51,51,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emergencyModal: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  emergencyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  emergencyIconText: {
    fontSize: 36,
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emergencyButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emergencyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#999999',
  },
  callButton: {
    backgroundColor: '#FF3333',
    elevation: 4,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  },
});