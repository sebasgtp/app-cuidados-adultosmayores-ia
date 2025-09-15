# Proyecto: App de Cuidados Adultos Mayores con IA

## 📌 Descripción
Aplicación móvil desarrollada con **React Native (Expo)** que permite a los usuarios gestionar de manera sencilla y práctica:

- Recordatorios de actividades
- Medicamentos
- Terapias o visitas médicas
- Chat con Inteligencia Artificial (OpenAI)
- Modo oscuro
- Dashboard con resumen de toda la información

Este proyecto fue diseñado como parte de un ejercicio académico para demostrar el proceso de **diseño, implementación y entrega de una aplicación funcional**.

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/sebasgtp/app-cuidados-adultosmayores-ia.git
cd app-cuidados-adultosmayores-ia
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
En el archivo `app.json`, dentro de `"extra"`, agrega tu API Key de OpenAI:
```json
"extra": {
  "openaiApiKey": "TU_API_KEY_AQUI"
}
```

### 4. Iniciar la aplicación
```bash
npx expo start
```

Escanea el QR con Expo Go en tu celular (iOS o Android).

---

## 📱 Funcionalidades principales

- **Dashboard**: muestra resumen de recordatorios, medicamentos y terapias guardadas.
- **Recordatorios**: crear, listar y mostrar recordatorios en el Dashboard.
- **Medicamentos**: registrar medicamentos con nombre y dosis.
- **Terapias**: agendar sesiones de terapia o visitas médicas.
- **Chat con IA**: conversar con un modelo de OpenAI en tiempo real.
- **Ajustes**: incluye modo oscuro (azul oscuro con buen contraste).

---

## 📂 Estructura del proyecto

```
frontend-new/
│── App.js
│── app.json
│── package.json
│── screens/
│   ├── DashboardScreen.js
│   ├── RemindersScreen.js
│   ├── MedicationScreen.js
│   ├── TherapyScreen.js
│   ├── ChatScreen.js
│   ├── SettingsScreen.js
│── components/
│   ├── styles.js
│── assets/
```

---

## 🛠️ Tecnologías utilizadas
- React Native con Expo
- React Navigation (para tabs y navegación)
- OpenAI API (chat con IA)
- Context API (para compartir datos entre pantallas)
- AsyncStorage (para persistencia local)
- Estilos con StyleSheet

---

## 👨‍💻 Autores
Proyecto desarrollado como ejercicio académico por:  
**Sebastián Gutiérrez Pineda**

---

## 📖 Licencia
Este proyecto es de uso académico y no tiene fines comerciales.
