import React, { useState } from "react";
import { SafeAreaView, TextInput, Text, TouchableOpacity, Alert } from "react-native-safe-area-context";
import { styles } from "../components/styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingrese email y contraseña");
      return;
    }
    // Aquí puedes implementar la lógica real de autenticación
    Alert.alert("Éxito", "Login correcto (simulado)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Correo" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
