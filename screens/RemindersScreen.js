// screens/ReminderScreen.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView,
  Dimensions,
  Modal,
  StyleSheet
} from "react-native";
import { baseStyles } from "../components/styles";

const { width } = Dimensions.get('window');

export default function ReminderScreen({ reminders = [], setReminders, darkMode = false }) {
  const [text, setText] = useState("");
  const [time, setTime] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState('#007AFF');
  
  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";
  const cardBg = darkMode ? "#123455" : "#fff";
  
  // Colores para las notas (azules, rojos y amarillos)
  const noteColors = ['#007AFF', '#0066CC', '#FF3333', '#CC0000', '#FFD700', '#FFA500'];
  
  // Función para obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  // Funciones para navegar entre meses y años
  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToPreviousYear = () => {
    setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth(), 1));
  };

  const goToNextYear = () => {
    setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 1));
  };

  const addReminder = () => {
    if (!text.trim() || !time.trim()) return;
    
    const newReminder = {
      id: Date.now().toString(),
      text: text.trim(),
      title: noteTitle.trim() || "Recordatorio",
      time: time.trim(),
      date: selectedDate.toLocaleDateString(),
      color: selectedColor,
      fullDate: selectedDate
    };
    
    setReminders([...reminders, newReminder]);
    setText("");
    setTime("");
    setNoteTitle("");
    setShowAddModal(false);
  };

  const renderCalendarDay = (day, index) => {
    const isToday = day && 
      day === new Date().getDate() && 
      selectedDate.getMonth() === new Date().getMonth() && 
      selectedDate.getFullYear() === new Date().getFullYear();
    
    const hasReminder = day && reminders.some(reminder => {
      const reminderDate = new Date(reminder.fullDate || reminder.date);
      return reminderDate.getDate() === day &&
        reminderDate.getMonth() === selectedDate.getMonth() &&
        reminderDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
      <TouchableOpacity 
        key={index}
        style={[
          styles.calendarDay,
          isToday && styles.todayDay,
          hasReminder && styles.dayWithReminder
        ]}
        onPress={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          !day && styles.emptyDay,
          { color: day ? (isToday ? '#fff' : textColor) : 'transparent' }
        ]}>
          {day || ''}
        </Text>
        {hasReminder && <View style={styles.reminderDot} />}
      </TouchableOpacity>
    );
  };

  const getTodayReminders = () => {
    const today = new Date().toLocaleDateString();
    return reminders.filter(reminder => reminder.date === today);
  };

  const renderReminder = ({ item }) => (
    <View style={[styles.reminderCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
      <View style={styles.reminderContent}>
        <Text style={[styles.reminderTitle, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.reminderText, { color: textColor }]}>{item.text}</Text>
        <Text style={[styles.reminderTime, { color: textColor + '80' }]}>{item.time}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
        <Text style={[styles.statusText, { color: item.color }]}>Pendiente</Text>
      </View>
    </View>
  );

  const renderTodayReminder = ({ item }) => (
    <View style={[styles.todayReminderCard, { backgroundColor: cardBg }]}>
      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
      <View style={styles.todayReminderContent}>
        <Text style={[styles.todayReminderTitle, { color: textColor }]}>{item.title}</Text>
        <Text style={[styles.todayReminderTime, { color: textColor + '80' }]}>{item.time}</Text>
      </View>
    </View>
  );

  const ColorPicker = () => (
    <View style={styles.colorPickerContainer}>
      <Text style={[styles.colorPickerTitle, { color: textColor }]}>Color</Text>
      <View style={styles.colorsRow}>
        {noteColors.map((color, index) => (
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
        {/* Header del Calendario */}
        <View style={[styles.calendarHeader, { backgroundColor: cardBg }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={[styles.menuIcon, { color: textColor }]}>☰</Text>
            </TouchableOpacity>
            <View style={styles.profileContainer}>
              <View style={styles.profilePic} />
            </View>
          </View>
          
          <View style={styles.monthYearNavigation}>
            <TouchableOpacity onPress={goToPreviousYear} style={styles.navButton}>
              <Text style={[styles.navButtonText, { color: textColor }]}>‹‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
              <Text style={[styles.navButtonText, { color: textColor }]}>‹</Text>
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: textColor }]}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
              <Text style={[styles.navButtonText, { color: textColor }]}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextYear} style={styles.navButton}>
              <Text style={[styles.navButtonText, { color: textColor }]}>››</Text>
            </TouchableOpacity>
          </View>
          
          {/* Días de la semana */}
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day, index) => (
              <Text key={index} style={[styles.weekDay, { color: textColor + '80' }]}>{day}</Text>
            ))}
          </View>
          
          {/* Calendario */}
          <View style={styles.calendarGrid}>
            {getDaysInMonth(selectedDate).map(renderCalendarDay)}
          </View>
        </View>

        {/* Sección Hoy */}
        <View style={styles.todaySection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Hoy</Text>
          {getTodayReminders().length === 0 ? (
            <Text style={[styles.noRemindersText, { color: textColor + '80' }]}>
              No hay recordatorios para hoy
            </Text>
          ) : (
            <FlatList
              data={getTodayReminders()}
              keyExtractor={(item) => item.id || item.text}
              renderItem={renderTodayReminder}
              showsVerticalScrollIndicator={false}
              style={styles.todayRemindersList}
            />
          )}
        </View>

        {/* Todos los recordatorios */}
        <View style={styles.allRemindersSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Todos los recordatorios</Text>
          {reminders.length === 0 ? (
            <Text style={[styles.noRemindersText, { color: textColor + '80' }]}>
              No hay recordatorios
            </Text>
          ) : (
            <FlatList
              data={reminders}
              keyExtractor={(item) => item.id || item.text}
              renderItem={renderReminder}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.remindersList}
            />
          )}
        </View>

        {/* Botón flotante para agregar - Ahora fijo */}
      </ScrollView>
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#007AFF' }]}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar nota */}
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
                <Text style={[styles.modalTitle, { color: textColor }]}>Agregar Nota</Text>
                <View style={styles.headerSpacer} />
              </View>

              {/* Selector de fecha y hora */}
              <View style={styles.dateTimeSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Fecha y Hora</Text>
                <View style={styles.dateTimeRow}>
                  <Text style={[styles.dateTimeText, { color: textColor }]}>
                    {selectedDate.getDate().toString().padStart(2, '0')}
                  </Text>
                  <Text style={[styles.dateTimeText, { color: textColor }]}>
                    {(selectedDate.getMonth() + 1).toString().padStart(2, '0')}
                  </Text>
                  <TextInput
                    style={[styles.timeInput, { color: textColor, backgroundColor: bg }]}
                    placeholder="08"
                    placeholderTextColor={textColor + '80'}
                    value={time.split(':')[0] || ''}
                    onChangeText={(hour) => {
                      const minute = time.split(':')[1] || '00';
                      setTime(`${hour}:${minute}`);
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <TextInput
                    style={[styles.timeInput, { color: textColor, backgroundColor: bg }]}
                    placeholder="59"
                    placeholderTextColor={textColor + '80'}
                    value={time.split(':')[1] || ''}
                    onChangeText={(minute) => {
                      const hour = time.split(':')[0] || '08';
                      setTime(`${hour}:${minute}`);
                    }}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={[styles.ampmText, { color: textColor }]}>AM</Text>
                </View>
              </View>

              {/* Título */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Título</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Escribe el título"
                  placeholderTextColor={textColor + '80'}
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
              </View>

              {/* Nota */}
              <View style={styles.inputSection}>
                <Text style={[styles.sectionLabel, { color: textColor }]}>Nota</Text>
                <TextInput
                  style={[styles.modalInput, styles.noteInput, { backgroundColor: bg, color: textColor }]}
                  placeholder="Escribe tu nota importante"
                  placeholderTextColor={textColor + '80'}
                  value={text}
                  onChangeText={setText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <ColorPicker />

              {/* Botón guardar */}
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
                onPress={addReminder}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
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
  calendarHeader: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  monthYearNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  navButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 17.5,
    position: 'relative',
  },
  todayDay: {
    backgroundColor: '#007AFF',
  },
  dayWithReminder: {
    backgroundColor: '#007AFF',
    opacity: 0.7,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyDay: {
    opacity: 0,
  },
  reminderDot: {
    position: 'absolute',
    bottom: 2,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
  todaySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  noRemindersText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  todayRemindersList: {
    maxHeight: 200,
  },
  todayReminderCard: {
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
  todayReminderContent: {
    flex: 1,
  },
  todayReminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  todayReminderTime: {
    fontSize: 14,
  },
  allRemindersSection: {
    marginBottom: 80,
  },
  remindersList: {
    paddingVertical: 10,
  },
  reminderCard: {
    width: 280,
    padding: 16,
    borderRadius: 16,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 16,
  },
  reminderContent: {
    marginLeft: 16,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  reminderTime: {
    fontSize: 12,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
    maxHeight: '85%',
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 600,
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
  dateTimeSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeText: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  timeInput: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'center',
    borderRadius: 8,
    padding: 8,
  },
  ampmText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  modalInput: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
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