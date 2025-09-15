// screens/SettingsScreen.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  View, 
  Text, 
  Switch, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput,
  Alert,
  StyleSheet,
  Dimensions
} from "react-native";
import { baseStyles } from "../components/styles";

const { width } = Dimensions.get('window');

export default function SettingsScreen({ darkMode, setDarkMode }) {
  const [notifications, setNotifications] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [therapyReminders, setTherapyReminders] = useState(true);
  const [dailyCheckIn, setDailyCheckIn] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [fontSize, setFontSize] = useState('Mediano');
  const [language, setLanguage] = useState('Español');
  const [selectedTheme, setSelectedTheme] = useState('Azul');
  
  // Estados para perfil de usuario
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";
  const cardBg = darkMode ? "#123455" : "#fff";
  
  // Opciones de configuración
  const fontSizes = ['Pequeño', 'Mediano', 'Grande', 'Extra Grande'];
  const languages = ['Español', 'English', 'Português', 'Français'];
  const themes = ['Azul', 'Verde', 'Púrpura', 'Naranja'];

  const handleExportData = () => {
    Alert.alert(
      'Exportar Datos',
      'Tus datos se exportarán en formato JSON. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => Alert.alert('Éxito', 'Datos exportados correctamente')
        }
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Eliminar Datos',
      '⚠️ Esta acción eliminará permanentemente todos tus datos. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => Alert.alert('Datos eliminados', 'Todos los datos han sido eliminados')
        }
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Restablecer App',
      'Esto restaurará la aplicación a su estado inicial. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restablecer', 
          style: 'destructive',
          onPress: () => Alert.alert('App restablecida', 'La aplicación ha sido restablecida')
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showArrow = false }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: cardBg }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: '#007AFF' + '20' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: textColor + '80' }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && (
          <Text style={[styles.arrow, { color: textColor + '60' }]}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: textColor }]}>{title}</Text>
  );

  const ProfileModal = () => (
    <Modal
      visible={showProfileModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowProfileModal(false)}
    >
      <View style={styles.modalOverlay}>
        <ScrollView 
          style={styles.modalScrollView}
          contentContainerStyle={styles.modalScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: textColor }]}>Perfil de Usuario</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.profilePicContainer}>
              <View style={[styles.profilePicLarge, { backgroundColor: '#007AFF' }]}>
                <Text style={styles.profileInitials}>{userName.charAt(0).toUpperCase()}</Text>
              </View>
              <TouchableOpacity style={styles.changePicButton}>
                <Text style={styles.changePicText}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Nombre completo</Text>
              <TextInput
                style={[styles.profileInput, { backgroundColor: bg, color: textColor }]}
                placeholder="Tu nombre completo"
                placeholderTextColor={textColor + '60'}
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Correo electrónico</Text>
              <TextInput
                style={[styles.profileInput, { backgroundColor: bg, color: textColor }]}
                placeholder="tu@email.com"
                placeholderTextColor={textColor + '60'}
                value={userEmail}
                onChangeText={setUserEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Edad</Text>
              <TextInput
                style={[styles.profileInput, { backgroundColor: bg, color: textColor }]}
                placeholder="Tu edad"
                placeholderTextColor={textColor + '60'}
                value={userAge}
                onChangeText={setUserAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Contacto de emergencia</Text>
              <TextInput
                style={[styles.profileInput, { backgroundColor: bg, color: textColor }]}
                placeholder="Número de teléfono"
                placeholderTextColor={textColor + '60'}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#007AFF' }]}
              onPress={() => {
                Alert.alert('Perfil guardado', 'Los cambios han sido guardados');
                setShowProfileModal(false);
              }}
            >
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  const AboutModal = () => (
    <Modal
      visible={showAboutModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAboutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAboutModal(false)}>
              <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>Acerca de</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.aboutContent}>
            <View style={[styles.appIconLarge, { backgroundColor: '#007AFF' }]}>
              <Text style={styles.appIconText}>⚕️</Text>
            </View>
            
            <Text style={[styles.appName, { color: textColor }]}>Salud Personal</Text>
            <Text style={[styles.appVersion, { color: textColor + '80' }]}>Versión 1.0.0</Text>
            
            <Text style={[styles.appDescription, { color: textColor + '80' }]}>
              Tu compañero integral para el cuidado de la salud personal. 
              Gestiona medicamentos, citas médicas, recordatorios y más.
            </Text>

            <View style={styles.aboutStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#007AFF' }]}>4.9</Text>
                <Text style={[styles.statLabel, { color: textColor + '80' }]}>Calificación</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>10K+</Text>
                <Text style={[styles.statLabel, { color: textColor + '80' }]}>Descargas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FFD700' }]}>2024</Text>
                <Text style={[styles.statLabel, { color: textColor + '80' }]}>Año</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.aboutButton, { backgroundColor: '#007AFF' + '20', borderColor: '#007AFF' }]}
              onPress={() => Alert.alert('Contacto', 'soporte@saludpersonal.com')}
            >
              <Text style={[styles.aboutButtonText, { color: '#007AFF' }]}>Contactar Soporte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const DataModal = () => (
    <Modal
      visible={showDataModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDataModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDataModal(false)}>
              <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>Gestión de Datos</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.dataContent}>
            <SettingItem
              icon="📤"
              title="Exportar Datos"
              subtitle="Descargar todos tus datos en formato JSON"
              onPress={handleExportData}
              showArrow={true}
            />
            
            <SettingItem
              icon="🔄"
              title="Hacer Respaldo"
              subtitle="Crear copia de seguridad en la nube"
              onPress={() => Alert.alert('Respaldo', 'Respaldo creado exitosamente')}
              showArrow={true}
            />
            
            <SettingItem
              icon="📥"
              title="Restaurar Datos"
              subtitle="Recuperar datos desde respaldo"
              onPress={() => Alert.alert('Restaurar', 'Selecciona un archivo de respaldo')}
              showArrow={true}
            />
            
            <View style={styles.dangerZone}>
              <Text style={[styles.dangerTitle, { color: '#FF3333' }]}>Zona de Peligro</Text>
              
              <SettingItem
                icon="🗑️"
                title="Eliminar Todos los Datos"
                subtitle="Borrar permanentemente toda la información"
                onPress={handleDeleteData}
                showArrow={true}
              />
              
              <SettingItem
                icon="🔄"
                title="Restablecer Aplicación"
                subtitle="Volver a configuración inicial"
                onPress={handleResetApp}
                showArrow={true}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
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
            <Text style={[styles.headerTitle, { color: textColor }]}>Ajustes</Text>
            <View style={styles.profileContainer}>
              <TouchableOpacity 
                style={[styles.profilePic, { backgroundColor: '#007AFF' }]}
                onPress={() => setShowProfileModal(true)}
              >
                <Text style={styles.profileText}>{userName.charAt(0).toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Perfil rápido */}
        <TouchableOpacity 
          style={[styles.quickProfile, { backgroundColor: cardBg }]}
          onPress={() => setShowProfileModal(true)}
        >
          <View style={styles.quickProfileLeft}>
            <View style={[styles.quickProfilePic, { backgroundColor: '#007AFF' }]}>
              <Text style={styles.quickProfileInitial}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.quickProfileInfo}>
              <Text style={[styles.quickProfileName, { color: textColor }]}>{userName}</Text>
              <Text style={[styles.quickProfileEmail, { color: textColor + '80' }]}>
                {userEmail || 'Agregar email'}
              </Text>
            </View>
          </View>
          <Text style={[styles.arrow, { color: textColor + '60' }]}>›</Text>
        </TouchableOpacity>

        {/* Apariencia */}
        <SectionHeader title="Apariencia" />
        
        <SettingItem
          icon="🌙"
          title="Modo Oscuro"
          subtitle="Interfaz oscura para mejor experiencia nocturna"
          rightComponent={
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: textColor + '30', true: '#007AFF' + '60' }}
              thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="🎨"
          title="Tema de Color"
          subtitle={`Actual: ${selectedTheme}`}
          onPress={() => Alert.alert('Temas', 'Próximamente más temas disponibles')}
          showArrow={true}
        />

        <SettingItem
          icon="🔤"
          title="Tamaño de Fuente"
          subtitle={`${fontSize} - Ajustar legibilidad`}
          onPress={() => Alert.alert('Fuente', 'Función disponible próximamente')}
          showArrow={true}
        />

        {/* Notificaciones */}
        <SectionHeader title="Notificaciones" />
        
        <SettingItem
          icon="🔔"
          title="Notificaciones"
          subtitle="Recibir alertas y recordatorios"
          rightComponent={
            <Switch 
              value={notifications} 
              onValueChange={setNotifications}
              trackColor={{ false: textColor + '30', true: '#007AFF' + '60' }}
              thumbColor={notifications ? '#007AFF' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="💊"
          title="Recordatorios de Medicamentos"
          subtitle="Alertas para tomar medicamentos"
          rightComponent={
            <Switch 
              value={medicationReminders} 
              onValueChange={setMedicationReminders}
              trackColor={{ false: textColor + '30', true: '#007AFF' + '60' }}
              thumbColor={medicationReminders ? '#007AFF' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="🏥"
          title="Recordatorios de Citas"
          subtitle="Alertas para terapias y consultas"
          rightComponent={
            <Switch 
              value={therapyReminders} 
              onValueChange={setTherapyReminders}
              trackColor={{ false: textColor + '30', true: '#007AFF' + '60' }}
              thumbColor={therapyReminders ? '#007AFF' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon="📅"
          title="Check-in Diario"
          subtitle="Recordatorio para registrar estado de salud"
          rightComponent={
            <Switch 
              value={dailyCheckIn} 
              onValueChange={setDailyCheckIn}
              trackColor={{ false: textColor + '30', true: '#007AFF' + '60' }}
              thumbColor={dailyCheckIn ? '#007AFF' : '#f4f3f4'}
            />
          }
        />

        {/* Privacidad y Datos */}
        <SectionHeader title="Privacidad y Datos" />
        
        <SettingItem
          icon="🔒"
          title="Privacidad"
          subtitle="Configurar protección de datos"
          onPress={() => Alert.alert('Privacidad', 'Tus datos están protegidos con encriptación')}
          showArrow={true}
        />

        <SettingItem
          icon="💾"
          title="Gestión de Datos"
          subtitle="Exportar, respaldar o eliminar datos"
          onPress={() => setShowDataModal(true)}
          showArrow={true}
        />

        <SettingItem
          icon="📊"
          title="Estadísticas de Uso"
          subtitle="Ver métricas de tu aplicación"
          onPress={() => Alert.alert('Estadísticas', 'Has usado la app 47 veces este mes')}
          showArrow={true}
        />

        {/* Soporte */}
        <SectionHeader title="Soporte y Ayuda" />
        
        <SettingItem
          icon="❓"
          title="Ayuda y Tutoriales"
          subtitle="Aprende a usar todas las funciones"
          onPress={() => Alert.alert('Ayuda', 'Visita nuestro centro de ayuda')}
          showArrow={true}
        />

        <SettingItem
          icon="📧"
          title="Contactar Soporte"
          subtitle="Obtener ayuda personalizada"
          onPress={() => Alert.alert('Soporte', 'soporte@saludpersonal.com')}
          showArrow={true}
        />

        <SettingItem
          icon="⭐"
          title="Calificar App"
          subtitle="Ayúdanos con tu opinión"
          onPress={() => Alert.alert('Calificación', '¡Gracias por tu feedback!')}
          showArrow={true}
        />

        <SettingItem
          icon="ℹ️"
          title="Acerca de"
          subtitle="Información de la aplicación"
          onPress={() => setShowAboutModal(true)}
          showArrow={true}
        />

        {/* Espacio adicional para scroll */}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modales */}
      <ProfileModal />
      <AboutModal />
      <DataModal />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickProfileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickProfileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickProfileInfo: {
    flex: 1,
  },
  quickProfileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickProfileEmail: {
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    marginLeft: 8,
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
    minHeight: 400,
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
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  changePicButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  changePicText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileInput: {
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  aboutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  aboutButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dataContent: {
    paddingTop: 10,
  },
  dangerZone: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#FF3333' + '30',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});