// screens/TherapyScreen.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";
import { baseStyles } from "../components/styles";

const { width } = Dimensions.get('window');

export default function TherapyScreen({ therapies = [], setTherapies, darkMode = false }) {
  const [therapyName, setTherapyName] = useState("");
  const [therapyDate, setTherapyDate] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [therapyType, setTherapyType] = useState("");
  const [therapistName, setTherapistName] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedColor, setSelectedColor] = useState('#007AFF');
  const [selectedCategory, setSelectedCategory] = useState('Terapia');
  const [selectedStatus, setSelectedStatus] = useState('Programada');
  
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";
  const cardBg = darkMode ? "#123455" : "#fff";
  
  // Colores para las terapias (azules, rojos y amarillos)
  const therapyColors = ['#007AFF', '#0066CC', '#FF3333', '#CC0000', '#FFD700', '#FFA500'];
  
  // Categorías de sesiones
  const categories = ['Terapia', 'Visita Médica', 'Consulta', 'Rehabilitación', 'Chequeo'];
  
  // Estados de las sesiones
  const statuses = ['Programada', 'Completada', 'Cancelada', 'Reagendada'];
  
  // Duraciones predefinidas
  const durations = ['30 min', '45 min', '1 hora', '1.5 horas', '2 horas'];

  const addTherapy = () => {
    if (!therapyName.trim() || !therapyDate.trim()) return;
    
    const newTherapy = {
      id: Date.now().toString(),
      name: therapyName.trim(),
      date: therapyDate.trim(),
      type: therapyType.trim(),
      therapist: therapistName.trim(),
      location: location.trim(),
      notes: notes.trim(),
      duration: duration,
      color: selectedColor,
      category: selectedCategory,
      status: selectedStatus,
      dateAdded: new Date().toLocaleDateString(),
      completed: selectedStatus === 'Completada'
    };
    
    setTherapies([...therapies, newTherapy]);
    setTherapyName("");
    setTherapyDate("");
    setTherapyType("");
    setTherapistName("");
    setLocation("");
    setNotes("");
    setDuration("");
    setShowAddModal(false);
  };

  const updateTherapyStatus = (index, newStatus) => {
    const updatedTherapies = therapies.map((therapy, i) => 
      i === index ? { 
        ...therapy, 
        status: newStatus, 
        completed: newStatus === 'Completada' 
      } : therapy
    );
    setTherapies(updatedTherapies);
  };

  const deleteTherapy = (index) => {
    const updatedTherapies = therapies.filter((_, i) => i !== index);
    setTherapies(updatedTherapies);
  };

  const getUpcomingTherapies = () => {
    const today = new Date();
    return therapies.filter(therapy => 
      therapy.status === 'Programada' || therapy.status === 'Reagendada'
    );
  };

  const getCompletedTherapies = () => {
    return therapies.filter(therapy => therapy.status === 'Completada');
  };

  const getTherapiesByStatus = () => {
    const grouped = {};
    statuses.forEach(status => {
      grouped[status] = therapies.filter(therapy => therapy.status === status);
    });
    return grouped;
  };

  const renderTherapy = ({ item, index }) => (
    <View style={[styles.therapyCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color || '#007AFF' }]} />
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTherapy(index)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
      
      <View style={styles.therapyHeader}>
        <View style={styles.categoryWithStatus}>
          <Text style={[styles.therapyCategory, { color: item.color || '#007AFF' }]}>
            {item.category || 'TERAPIA'}
          </Text>
          <TouchableOpacity
            style={[styles.statusBadge, { 
              backgroundColor: getStatusColor(item.status || 'Programada')
            }]}
            onPress={() => {
              const currentIndex = statuses.indexOf(item.status || 'Programada');
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              updateTherapyStatus(index, nextStatus);
            }}
          >
            <Text style={styles.statusText}>
              {item.status || 'Programada'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.therapyName, { color: textColor }]}>
        {item.name}
      </Text>
      
      <Text style={[styles.therapyDate, { color: textColor }]}>
        📅 {item.date}
      </Text>
      
      {(item.therapist || item.type) && (
        <Text style={[styles.therapyDetail, { color: textColor + '80' }]}>
          👨‍⚕️ {item.therapist || item.type}
        </Text>
      )}
      
      {item.location && (
        <Text style={[styles.therapyDetail, { color: textColor + '80' }]}>
          📍 {item.location}
        </Text>
      )}
      
      {item.duration && (
        <Text style={[styles.therapyDetail, { color: textColor + '80' }]}>
          ⏱️ {item.duration}
        </Text>
      )}
      
      {item.notes && (
        <Text style={[styles.therapyNotes, { color: textColor + '80' }]}>
          📝 {item.notes}
        </Text>
      )}
      
      <Text style={[styles.therapyDateAdded, { color: textColor + '60' }]}>
        Agregado: {item.dateAdded || new Date().toLocaleDateString()}
      </Text>
    </View>
  );

  const renderUpcomingTherapy = ({ item, index }) => (
    <View style={[styles.upcomingTherapyCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorDot, { backgroundColor: item.color || '#007AFF' }]} />
      <View style={styles.upcomingTherapyContent}>
        <Text style={[styles.upcomingTherapyName, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.upcomingTherapyDate, { color: textColor + '80' }]}>
          {item.date}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.completeButton, { backgroundColor: item.color + '20' || '#007AFF20' }]}
        onPress={() => updateTherapyStatus(therapies.indexOf(item), 'Completada')}
      >
        <Text style={[styles.completeButtonText, { color: item.color || '#007AFF' }]}>
          ✓
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Programada': return '#007AFF';
      case 'Completada': return '#4CAF50';
      case 'Cancelada': return '#FF3333';
      case 'Reagendada': return '#FFD700';
      default: return '#007AFF';
    }
  };

  const CategorySelector = () => (
    <View style={styles.categorySection}>
      <Text style={[styles.sectionLabel, { color: textColor }]}>Tipo de sesión</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryRow}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryOption,
                { backgroundColor: selectedCategory === category ? '#007AFF' : cardBg },
                { borderColor: selectedCategory === category ? '#007AFF' : textColor + '30' }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category ? '#fff' : textColor }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const StatusSelector = () => (
    <View style={styles.statusSection}>
      <Text style={[styles.sectionLabel, { color: textColor }]}>Estado</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.statusRow}>
          {statuses.map((status, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.statusOption,
                { backgroundColor: selectedStatus === status ? getStatusColor(status) : cardBg },
                { borderColor: selectedStatus === status ? getStatusColor(status) : textColor + '30' }
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.statusOptionText,
                { color: selectedStatus === status ? '#fff' : textColor }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const DurationSelector = () => (
    <View style={styles.durationSection}>
      <Text style={[styles.sectionLabel, { color: textColor }]}>Duración</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.durationRow}>
          {durations.map((dur, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.durationOption,
                { backgroundColor: duration === dur ? '#007AFF' : cardBg },
                { borderColor: duration === dur ? '#007AFF' : textColor + '30' }
              ]}
              onPress={() => setDuration(dur)}
            >
              <Text style={[
                styles.durationText,
                { color: duration === dur ? '#fff' : textColor }
              ]}>
                {dur}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const ColorPicker = () => (
    <View style={styles.colorPickerContainer}>
      <Text style={[styles.colorPickerTitle, { color: textColor }]}>Color</Text>
      <View style={styles.colorsRow}>
        {therapyColors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={[styles.menuIcon, { color: textColor }]}>☰</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Terapias</Text>
            <View style={styles.profileContainer}>
              <View style={[styles.profilePic, { backgroundColor: '#007AFF' }]} />
            </View>
          </View>
        </View>

        {/* Resumen rápido */}
        <View style={[styles.summaryCard, { backgroundColor: cardBg }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#007AFF' }]}>
                {getUpcomingTherapies().length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Próximas</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#4CAF50' }]}>
                {getCompletedTherapies().length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Completadas</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#FFD700' }]}>
                {therapies.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Total</Text>
            </View>
          </View>
        </View>

        {/* Próximas sesiones */}
        <View style={styles.upcomingSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Próximas sesiones</Text>
          {getUpcomingTherapies().length === 0 ? (
            <Text style={[styles.noTherapiesText, { color: textColor + '80' }]}>
              No hay sesiones programadas
            </Text>
          ) : (
            <FlatList
              data={getUpcomingTherapies()}
              keyExtractor={(item) => item.id || item.name}
              renderItem={renderUpcomingTherapy}
              showsVerticalScrollIndicator={false}
              style={styles.upcomingTherapiesList}
            />
          )}
        </View>

        {/* Todas las sesiones */}
        <View style={styles.allTherapiesSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Todas las sesiones</Text>
          {therapies.length === 0 ? (
            <Text style={[styles.noTherapiesText, { color: textColor + '80' }]}>
              No hay sesiones registradas
            </Text>
          ) : (
            <FlatList
              data={therapies}
              keyExtractor={(item, i) => item.id || i.toString()}
              renderItem={renderTherapy}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.therapiesList}
            />
          )}
        </View>
      </ScrollView>

      {/* Botón flotante para agregar - Fijo */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#007AFF' }]}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar terapia */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: textColor }]}>Agregar Terapia</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Nombre de la sesión */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Nombre de la sesión</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: Fisioterapia, Consulta cardiológica..."
                  placeholderTextColor={textColor + '80'}
                  value={therapyName}
                  onChangeText={setTherapyName}
                />
              </View>

              {/* Fecha y hora */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Fecha y hora</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: 15 Sep 10:00, Lunes 2:30 PM..."
                  placeholderTextColor={textColor + '80'}
                  value={therapyDate}
                  onChangeText={setTherapyDate}
                />
              </View>

              {/* Terapeuta/Médico */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Terapeuta / Médico</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: Dr. García, Fisioterapeuta María..."
                  placeholderTextColor={textColor + '80'}
                  value={therapistName}
                  onChangeText={setTherapistName}
                />
              </View>

              {/* Lugar */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Lugar</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: Clínica Santa Fe, Consultorio 202..."
                  placeholderTextColor={textColor + '80'}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              {/* Notas */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Notas adicionales</Text>
                <TextInput
                  style={[styles.modalInput, styles.notesInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Observaciones, recordatorios..."
                  placeholderTextColor={textColor + '80'}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <CategorySelector />
              <StatusSelector />
              <DurationSelector />
              <ColorPicker />

              {/* Botón guardar */}
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
                onPress={addTherapy}
              >
                <Text style={styles.saveButtonText}>Guardar Sesión</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  upcomingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noTherapiesText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  upcomingTherapiesList: {
    maxHeight: 300,
  },
  upcomingTherapyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  upcomingTherapyContent: {
    flex: 1,
  },
  upcomingTherapyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingTherapyDate: {
    fontSize: 14,
  },
  completeButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  allTherapiesSection: {
    marginBottom: 80,
  },
  therapiesList: {
    paddingVertical: 10,
  },
  therapyCard: {
    width: 340,
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  colorIndicator: {
    width: 4,
    height: 80,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  therapyHeader: {
    marginBottom: 10,
    marginLeft: 16,
  },
  categoryWithStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  therapyCategory: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  therapyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 16,
  },
  therapyDate: {
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 16,
  },
  therapyDetail: {
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 16,
  },
  therapyNotes: {
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 16,
    fontStyle: 'italic',
  },
  therapyDateAdded: {
    fontSize: 11,
    marginLeft: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalScrollView: {
    maxHeight: '90%',
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 800,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 18,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalInput: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusSection: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  statusOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  durationSection: {
    marginBottom: 20,
  },
  durationRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  durationOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorPickerContainer: {
    marginBottom: 20,
  },
  colorPickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  colorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  colorOption: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginHorizontal: 3,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});