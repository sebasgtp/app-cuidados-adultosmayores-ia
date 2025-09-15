// screens/MedicationScreen.js
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

export default function MedicationScreen({ medications = [], setMedications, darkMode = false }) {
  const [disease, setDisease] = useState("");
  const [medication, setMedication] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [medicationTitle, setMedicationTitle] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [selectedColor, setSelectedColor] = useState('#007AFF');
  const [selectedCategory, setSelectedCategory] = useState('Medicamento');
  
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";
  const cardBg = darkMode ? "#123455" : "#fff";
  
  // Colores para los medicamentos (azules, rojos y amarillos)
  const medicationColors = ['#007AFF', '#0066CC', '#FF3333', '#CC0000', '#FFD700', '#FFA500'];
  
  // Categorías de medicamentos
  const categories = ['Medicamento', 'Vitamina', 'Suplemento', 'Tratamiento', 'Emergencia'];
  
  // Frecuencias predefinidas
  const frequencies = ['Una vez al día', 'Dos veces al día', 'Tres veces al día', 'Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Según necesidad'];

  const addMedication = () => {
    if (!disease.trim() || !medication.trim()) return;
    
    const newMedication = {
      id: Date.now().toString(),
      disease: disease.trim(),
      name: medication.trim(),
      title: medicationTitle.trim() || medication.trim(),
      dosage: dosage.trim(),
      frequency: frequency,
      color: selectedColor,
      category: selectedCategory,
      dateAdded: new Date().toLocaleDateString(),
      active: true
    };
    
    setMedications([...medications, newMedication]);
    setDisease("");
    setMedication("");
    setMedicationTitle("");
    setDosage("");
    setFrequency("");
    setShowAddModal(false);
  };

  const toggleMedicationStatus = (index) => {
    const updatedMedications = medications.map((med, i) => 
      i === index ? { ...med, active: !med.active } : med
    );
    setMedications(updatedMedications);
  };

  const deleteMedication = (index) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const getActiveMedications = () => {
    return medications.filter(med => med.active);
  };

  const getMedicationsByCategory = () => {
    const grouped = {};
    categories.forEach(cat => {
      grouped[cat] = medications.filter(med => med.category === cat || (!med.category && cat === 'Medicamento'));
    });
    return grouped;
  };

  const renderMedication = ({ item, index }) => (
    <View style={[styles.medicationCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color || '#007AFF' }]} />
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteMedication(index)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
      
      <View style={styles.medicationHeader}>
        <View style={styles.categoryWithStatus}>
          <Text style={[styles.medicationCategory, { color: item.color || '#007AFF' }]}>
            {item.category || 'MEDICAMENTO'}
          </Text>
          <TouchableOpacity
            style={[styles.statusBadge, { 
              backgroundColor: item.active ? '#4CAF50' : '#999',
              opacity: item.active ? 1 : 0.6
            }]}
            onPress={() => toggleMedicationStatus(index)}
          >
            <Text style={styles.statusText}>
              {item.active ? 'Activo' : 'Pausado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.medicationName, { color: textColor }]}>
        {item.title || item.name}
      </Text>
      
      <Text style={[styles.medicationDisease, { color: textColor }]}>
        Para: {item.disease}
      </Text>
      
      {item.dosage && (
        <Text style={[styles.medicationDosage, { color: textColor + '80' }]}>
          Dosis: {item.dosage}
        </Text>
      )}
      
      {item.frequency && (
        <Text style={[styles.medicationFrequency, { color: textColor + '80' }]}>
          Frecuencia: {item.frequency}
        </Text>
      )}
      
      <Text style={[styles.medicationDate, { color: textColor + '60' }]}>
        Agregado: {item.dateAdded || new Date().toLocaleDateString()}
      </Text>
    </View>
  );

  const renderActiveMedication = ({ item, index }) => (
    <View style={[styles.activeMedicationCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorDot, { backgroundColor: item.color || '#007AFF' }]} />
      <View style={styles.activeMedicationContent}>
        <Text style={[styles.activeMedicationName, { color: textColor }]}>
          {item.title || item.name}
        </Text>
        <Text style={[styles.activeMedicationFreq, { color: textColor + '80' }]}>
          {item.frequency || 'Según indicación médica'}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.pauseButton, { backgroundColor: item.color + '20' || '#007AFF20' }]}
        onPress={() => toggleMedicationStatus(index)}
      >
        <Text style={[styles.pauseButtonText, { color: item.color || '#007AFF' }]}>
          ⏸
        </Text>
      </TouchableOpacity>
    </View>
  );

  const CategorySelector = () => (
    <View style={styles.categorySection}>
      <Text style={[styles.sectionLabel, { color: textColor }]}>Categoría</Text>
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

  const FrequencySelector = () => (
    <View style={styles.frequencySection}>
      <Text style={[styles.sectionLabel, { color: textColor }]}>Frecuencia</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.frequencyRow}>
          {frequencies.map((freq, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.frequencyOption,
                { backgroundColor: frequency === freq ? '#007AFF' : cardBg },
                { borderColor: frequency === freq ? '#007AFF' : textColor + '30' }
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text style={[
                styles.frequencyText,
                { color: frequency === freq ? '#fff' : textColor }
              ]}>
                {freq}
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
        {medicationColors.map((color, index) => (
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
            <Text style={[styles.headerTitle, { color: textColor }]}>Medicamentos</Text>
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
                {getActiveMedications().length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Activos</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#FF3333' }]}>
                {medications.length - getActiveMedications().length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Pausados</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: '#FFD700' }]}>
                {medications.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: textColor + '80' }]}>Total</Text>
            </View>
          </View>
        </View>

        {/* Medicamentos activos de hoy */}
        <View style={styles.todaySection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Medicamentos de hoy</Text>
          {getActiveMedications().length === 0 ? (
            <Text style={[styles.noMedicationsText, { color: textColor + '80' }]}>
              No hay medicamentos activos
            </Text>
          ) : (
            <FlatList
              data={getActiveMedications()}
              keyExtractor={(item) => item.id || item.name}
              renderItem={renderActiveMedication}
              showsVerticalScrollIndicator={false}
              style={styles.activeMedicationsList}
            />
          )}
        </View>

        {/* Todos los medicamentos */}
        <View style={styles.allMedicationsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Todos los medicamentos</Text>
          {medications.length === 0 ? (
            <Text style={[styles.noMedicationsText, { color: textColor + '80' }]}>
              No hay medicamentos registrados
            </Text>
          ) : (
            <FlatList
              data={medications}
              keyExtractor={(item, i) => item.id || i.toString()}
              renderItem={renderMedication}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.medicationsList}
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

      {/* Modal para agregar medicamento */}
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
                <Text style={[styles.modalTitle, { color: textColor }]}>Agregar Medicamento</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Título del medicamento */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Nombre del medicamento</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: Paracetamol, Vitamina D3..."
                  placeholderTextColor={textColor + '80'}
                  value={medication}
                  onChangeText={setMedication}
                />
              </View>

              {/* Enfermedad/Condición */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Para qué condición</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: Dolor de cabeza, Deficiencia vitamínica..."
                  placeholderTextColor={textColor + '80'}
                  value={disease}
                  onChangeText={setDisease}
                />
              </View>

              {/* Dosis */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Dosis</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Ej: 500mg, 1 tableta, 5ml..."
                  placeholderTextColor={textColor + '80'}
                  value={dosage}
                  onChangeText={setDosage}
                />
              </View>

              <CategorySelector />
              <FrequencySelector />
              <ColorPicker />

              {/* Botón guardar */}
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
                onPress={addMedication}
              >
                <Text style={styles.saveButtonText}>Guardar Medicamento</Text>
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
  todaySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noMedicationsText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  activeMedicationsList: {
    maxHeight: 300,
  },
  activeMedicationCard: {
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
  activeMedicationContent: {
    flex: 1,
  },
  activeMedicationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeMedicationFreq: {
    fontSize: 14,
  },
  pauseButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  allMedicationsSection: {
    marginBottom: 80,
  },
  medicationsList: {
    paddingVertical: 10,
  },
  medicationCard: {
    width: 320,
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
    height: 60,
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
  medicationHeader: {
    marginBottom: 10,
    marginLeft: 16,
  },
  categoryWithStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  medicationCategory: {
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
  medicationName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 16,
  },
  medicationDisease: {
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 16,
  },
  medicationDosage: {
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 16,
  },
  medicationFrequency: {
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 16,
  },
  medicationDate: {
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
    minHeight: 700,
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
  frequencySection: {
    marginBottom: 20,
  },
  frequencyRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  frequencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  frequencyText: {
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