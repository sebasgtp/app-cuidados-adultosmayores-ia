import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Button, 
  FlatList, 
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  ScrollView,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function HomeScreen({ darkMode = false }) {
  // Estados originales MANTENIDOS
  const [therapy, setTherapy] = useState("");
  const [list, setList] = useState([]);

  // Estados nuevos AGREGADOS (no modifican original)
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [therapyDetails, setTherapyDetails] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    therapist: '',
    notes: '',
    category: 'Fisioterapia',
    status: 'Programada'
  });

  // Colores dinámicos según darkMode
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#ffffff" : "#111";
  const cardBg = darkMode ? "#1E3A5F" : "#ffffff";

  // Función original MANTENIDA
  const addTherapy = () => {
    if (!therapy.trim()) return;
    setList([...list, therapy]);
    setTherapy("");
  };

  // Nuevas funciones AGREGADAS
  const addEnhancedTherapy = () => {
    if (!therapyDetails.name.trim()) {
      Alert.alert("Error", "El nombre de la terapia es obligatorio");
      return;
    }
    
    const newTherapy = {
      id: Date.now().toString(),
      ...therapyDetails,
      createdAt: new Date().toISOString(),
      color: getRandomColor()
    };
    
    setList([...list, newTherapy]);
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setTherapyDetails({
      name: '',
      date: '',
      time: '',
      location: '',
      therapist: '',
      notes: '',
      category: 'Fisioterapia',
      status: 'Programada'
    });
  };

  const getRandomColor = () => {
    const colors = ['#007AFF', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleItemPress = (item, index) => {
    setSelectedItem(typeof item === 'string' ? { name: item, index } : { ...item, index });
    setShowDetailModal(true);
  };

  const deleteItem = (index) => {
    Alert.alert(
      "Eliminar Terapia",
      "¿Estás seguro de que quieres eliminar esta terapia?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            const newList = list.filter((_, i) => i !== index);
            setList(newList);
            setShowDetailModal(false);
          }
        }
      ]
    );
  };

  const toggleStatus = (index) => {
    const statuses = ['Programada', 'En Progreso', 'Completada', 'Cancelada'];
    const newList = [...list];
    const item = newList[index];
    
    if (typeof item === 'object') {
      const currentIndex = statuses.indexOf(item.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      item.status = statuses[nextIndex];
      setList(newList);
      setSelectedItem({...item, index});
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Programada': return '#007AFF';
      case 'En Progreso': return '#FF9800';
      case 'Completada': return '#4CAF50';
      case 'Cancelada': return '#F44336';
      default: return '#999999';
    }
  };

  // Función para emergencia AGREGADA
  const handleEmergencyCall = () => {
    setShowEmergencyModal(true);
  };

  const confirmEmergencyCall = () => {
    setShowEmergencyModal(false);
    const emergencyNumber = '911'; // Cambiar a '123' para Colombia
    
    Alert.alert(
      "Llamando a Emergencias",
      `Conectando con ${emergencyNumber}...`,
      [
        { text: "Cancelar", style: "cancel" },
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

  // Componentes nuevos AGREGADOS
  const StatsPanel = () => {
    const programadas = list.filter(item => typeof item === 'object' ? item.status === 'Programada' : true).length;
    const completadas = list.filter(item => typeof item === 'object' && item.status === 'Completada').length;
    
    return (
      <View style={[enhancedStyles.statsContainer, { backgroundColor: cardBg }]}>
        <View style={enhancedStyles.statItem}>
          <Text style={[enhancedStyles.statNumber, { color: '#007AFF' }]}>
            {list.length}
          </Text>
          <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
            Total
          </Text>
        </View>
        <View style={enhancedStyles.statItem}>
          <Text style={[enhancedStyles.statNumber, { color: '#FF9800' }]}>
            {programadas}
          </Text>
          <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
            Programadas
          </Text>
        </View>
        <View style={enhancedStyles.statItem}>
          <Text style={[enhancedStyles.statNumber, { color: '#4CAF50' }]}>
            {completadas}
          </Text>
          <Text style={[enhancedStyles.statLabel, { color: textColor, opacity: 0.7 }]}>
            Completadas
          </Text>
        </View>
      </View>
    );
  };

  const CategorySelector = ({ value, onChange }) => {
    const categories = ['Fisioterapia', 'Psicología', 'Consulta Médica', 'Rehabilitación', 'Otro'];
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={enhancedStyles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              enhancedStyles.categoryPill,
              { 
                backgroundColor: value === category ? '#007AFF' : (darkMode ? '#1E3A5F' : '#f0f0f0'),
                borderColor: value === category ? '#007AFF' : (darkMode ? '#444' : '#ddd')
              }
            ]}
            onPress={() => onChange(category)}
          >
            <Text style={[
              enhancedStyles.categoryText,
              { color: value === category ? 'white' : textColor }
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const AddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={enhancedStyles.modalOverlay}>
        <View style={[enhancedStyles.modalContent, { backgroundColor: cardBg }]}>
          <View style={enhancedStyles.modalHeader}>
            <Text style={[enhancedStyles.modalTitle, { color: textColor }]}>
              🏥 Nueva Terapia
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAddModal(false)}
              style={enhancedStyles.closeButton}
            >
              <Text style={enhancedStyles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={enhancedStyles.modalBody}>
            <View style={enhancedStyles.formGroup}>
              <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Nombre de la Terapia *</Text>
              <TextInput
                style={[enhancedStyles.formInput, { 
                  backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                  color: textColor,
                  borderColor: darkMode ? '#444' : '#ddd'
                }]}
                placeholder="Ej: Fisioterapia espalda"
                placeholderTextColor={darkMode ? '#999' : '#666'}
                value={therapyDetails.name}
                onChangeText={(text) => setTherapyDetails({...therapyDetails, name: text})}
              />
            </View>

            <View style={enhancedStyles.formRow}>
              <View style={[enhancedStyles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Fecha</Text>
                <TextInput
                  style={[enhancedStyles.formInput, { 
                    backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                    color: textColor,
                    borderColor: darkMode ? '#444' : '#ddd'
                  }]}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={darkMode ? '#999' : '#666'}
                  value={therapyDetails.date}
                  onChangeText={(text) => setTherapyDetails({...therapyDetails, date: text})}
                />
              </View>
              <View style={[enhancedStyles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Hora</Text>
                <TextInput
                  style={[enhancedStyles.formInput, { 
                    backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                    color: textColor,
                    borderColor: darkMode ? '#444' : '#ddd'
                  }]}
                  placeholder="HH:MM"
                  placeholderTextColor={darkMode ? '#999' : '#666'}
                  value={therapyDetails.time}
                  onChangeText={(text) => setTherapyDetails({...therapyDetails, time: text})}
                />
              </View>
            </View>

            <View style={enhancedStyles.formGroup}>
              <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Ubicación</Text>
              <TextInput
                style={[enhancedStyles.formInput, { 
                  backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                  color: textColor,
                  borderColor: darkMode ? '#444' : '#ddd'
                }]}
                placeholder="Clínica, hospital, consultorio..."
                placeholderTextColor={darkMode ? '#999' : '#666'}
                value={therapyDetails.location}
                onChangeText={(text) => setTherapyDetails({...therapyDetails, location: text})}
              />
            </View>

            <View style={enhancedStyles.formGroup}>
              <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Terapeuta/Doctor</Text>
              <TextInput
                style={[enhancedStyles.formInput, { 
                  backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                  color: textColor,
                  borderColor: darkMode ? '#444' : '#ddd'
                }]}
                placeholder="Nombre del profesional"
                placeholderTextColor={darkMode ? '#999' : '#666'}
                value={therapyDetails.therapist}
                onChangeText={(text) => setTherapyDetails({...therapyDetails, therapist: text})}
              />
            </View>

            <View style={enhancedStyles.formGroup}>
              <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Categoría</Text>
              <CategorySelector 
                value={therapyDetails.category}
                onChange={(category) => setTherapyDetails({...therapyDetails, category})}
              />
            </View>

            <View style={enhancedStyles.formGroup}>
              <Text style={[enhancedStyles.formLabel, { color: textColor }]}>Notas adicionales</Text>
              <TextInput
                style={[enhancedStyles.formInput, enhancedStyles.textArea, { 
                  backgroundColor: darkMode ? '#2A4A6B' : '#f8f9fa',
                  color: textColor,
                  borderColor: darkMode ? '#444' : '#ddd'
                }]}
                placeholder="Observaciones, recomendaciones..."
                placeholderTextColor={darkMode ? '#999' : '#666'}
                value={therapyDetails.notes}
                onChangeText={(text) => setTherapyDetails({...therapyDetails, notes: text})}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={enhancedStyles.saveButton}
            onPress={addEnhancedTherapy}
          >
            <Text style={enhancedStyles.saveButtonText}>💾 Guardar Terapia</Text>
          </TouchableOpacity>
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
        <View style={[enhancedStyles.modalContent, { backgroundColor: cardBg }]}>
          <View style={enhancedStyles.modalHeader}>
            <Text style={[enhancedStyles.modalTitle, { color: textColor }]}>
              🏥 Detalles de Terapia
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
              {typeof selectedItem === 'object' && selectedItem.status && (
                <TouchableOpacity 
                  style={[enhancedStyles.statusBadge, { backgroundColor: getStatusColor(selectedItem.status) }]}
                  onPress={() => toggleStatus(selectedItem.index)}
                >
                  <Text style={enhancedStyles.statusText}>
                    {selectedItem.status} (Tocar para cambiar)
                  </Text>
                </TouchableOpacity>
              )}
              
              <View style={enhancedStyles.detailRow}>
                <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                  Nombre:
                </Text>
                <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                  {selectedItem.name || selectedItem}
                </Text>
              </View>
              
              {selectedItem.date && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Fecha:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                    📅 {selectedItem.date}
                  </Text>
                </View>
              )}
              
              {selectedItem.time && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Hora:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                    ⏰ {selectedItem.time}
                  </Text>
                </View>
              )}
              
              {selectedItem.location && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Ubicación:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                    📍 {selectedItem.location}
                  </Text>
                </View>
              )}
              
              {selectedItem.therapist && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Profesional:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                    👨‍⚕️ {selectedItem.therapist}
                  </Text>
                </View>
              )}
              
              {selectedItem.category && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Categoría:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: '#007AFF' }]}>
                    {selectedItem.category}
                  </Text>
                </View>
              )}
              
              {selectedItem.notes && (
                <View style={enhancedStyles.detailRow}>
                  <Text style={[enhancedStyles.detailLabel, { color: textColor, opacity: 0.7 }]}>
                    Notas:
                  </Text>
                  <Text style={[enhancedStyles.detailValue, { color: textColor }]}>
                    {selectedItem.notes}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={enhancedStyles.deleteButton}
                onPress={() => deleteItem(selectedItem.index)}
              >
                <Text style={enhancedStyles.deleteButtonText}>🗑️ Eliminar Terapia</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  const EmergencyModal = () => (
    <Modal
      visible={showEmergencyModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowEmergencyModal(false)}
    >
      <View style={enhancedStyles.emergencyOverlay}>
        <View style={[enhancedStyles.emergencyModal, { backgroundColor: cardBg }]}>
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

  const renderEnhancedItem = ({ item, index }) => (
    <TouchableOpacity
      style={[enhancedStyles.therapyCard, { backgroundColor: cardBg }]}
      onPress={() => handleItemPress(item, index)}
    >
      <View style={[
        enhancedStyles.cardIndicator, 
        { backgroundColor: typeof item === 'object' ? item.color : '#007AFF' }
      ]} />
      
      <View style={enhancedStyles.cardContent}>
        <View style={enhancedStyles.cardHeader}>
          <Text style={[enhancedStyles.cardCategory, { 
            color: typeof item === 'object' ? (item.color || '#007AFF') : '#007AFF' 
          }]}>
            {typeof item === 'object' ? item.category?.toUpperCase() : 'TERAPIA'}
          </Text>
          {typeof item === 'object' && item.status && (
            <View style={[enhancedStyles.miniStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={enhancedStyles.miniStatusText}>{item.status}</Text>
            </View>
          )}
        </View>
        
        <Text style={[enhancedStyles.cardTitle, { color: textColor }]}>
          🏥 {typeof item === 'string' ? item : item.name}
        </Text>
        
        {typeof item === 'object' && (
          <>
            {item.date && (
              <Text style={[enhancedStyles.cardSubtitle, { color: textColor, opacity: 0.8 }]}>
                📅 {item.date} {item.time && `⏰ ${item.time}`}
              </Text>
            )}
            {item.location && (
              <Text style={[enhancedStyles.cardDetails, { color: textColor, opacity: 0.7 }]}>
                📍 {item.location}
              </Text>
            )}
            {item.therapist && (
              <Text style={[enhancedStyles.cardDetails, { color: textColor, opacity: 0.7 }]}>
                👨‍⚕️ {item.therapist}
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  // ESTRUCTURA ORIGINAL MANTENIDA
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header mejorado AGREGADO */}
      <View style={[enhancedStyles.header, { backgroundColor: bg }]}>
        <TouchableOpacity style={enhancedStyles.menuButton}>
          <Text style={[enhancedStyles.menuIcon, { color: textColor }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[enhancedStyles.appTitle, { color: textColor }]}>
          Terapias
        </Text>
        <View style={enhancedStyles.profileContainer}>
          <View style={[enhancedStyles.profilePicture, { backgroundColor: '#007AFF' }]}>
            <Text style={enhancedStyles.profileInitial}>U</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Contenedor original MANTENIDO (oculto) */}
        <View style={[styles.container, { display: 'none' }]}>
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

        {/* Contenido mejorado AGREGADO */}
        <View style={enhancedStyles.container}>
          {/* Panel de estadísticas */}
          <StatsPanel />

          {/* Botón de agregar mejorado */}
          <TouchableOpacity 
            style={enhancedStyles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={enhancedStyles.addButtonText}>+ Nueva Terapia</Text>
          </TouchableOpacity>

          {/* Lista mejorada */}
          {list.length === 0 ? (
            <View style={[enhancedStyles.emptyState, { backgroundColor: cardBg }]}>
              <Text style={enhancedStyles.emptyIcon}>🏥</Text>
              <Text style={[enhancedStyles.emptyTitle, { color: textColor }]}>
                No hay terapias registradas
              </Text>
              <Text style={[enhancedStyles.emptySubtitle, { color: textColor, opacity: 0.7 }]}>
                Agrega tu primera terapia tocando el botón de arriba
              </Text>
            </View>
          ) : (
            <FlatList
              data={list}
              keyExtractor={(item, i) => i.toString()}
              renderItem={renderEnhancedItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Modales AGREGADOS */}
      <AddModal />
      <DetailModal />
      <EmergencyModal />

      {/* Botón de emergencia AGREGADO */}
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

// Estilos originales MANTENIDOS
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

// Estilos nuevos AGREGADOS
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

  // Contenedor principal
  container: {
    flex: 1,
    padding: 16,
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

  // Botón agregar
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Cards de terapia
  therapyCard: {
    borderRadius: 16,
    marginBottom: 16,
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
  cardContent: {
    flex: 1,
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
  miniStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  miniStatusText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 13,
    marginBottom: 2,
  },

  // Estado vacío
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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

  // Formulario
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Selector de categorías
  categoryContainer: {
    marginVertical: 8,
  },
  categoryPill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Botón guardar
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Detalles
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },

  // Botón eliminar
  deleteButton: {
    backgroundColor: '#FF3333',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#FF3333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Botón de emergencia
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

  // Modal de emergencia
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