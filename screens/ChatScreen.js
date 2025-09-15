// screens/ChatScreen.js
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { baseStyles } from "../components/styles";

export default function ChatScreen({ darkMode = false }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatRef = useRef(null);

  const apiKey = Constants.expoConfig?.extra?.openaiApiKey || null;

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    // Si hay API key, llamamos a OpenAI; si no, respuesta simulada
    if (apiKey) {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userMsg.text }],
          }),
        });
        const data = await resp.json();
        const reply = data?.choices?.[0]?.message?.content || "No obtuve respuesta.";
        const aiMsg = { id: Date.now().toString() + "-ai", sender: "ai", text: reply };
        setMessages((prev) => [...prev, aiMsg]);
        setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 200);
      } catch (err) {
        console.error(err);
        const errMsg = { id: Date.now().toString() + "-err", sender: "ai", text: "Error al conectar con la IA." };
        setMessages((prev) => [...prev, errMsg]);
      }
    } else {
      // respuesta simulada si no hay API key
      const aiMsg = { id: Date.now().toString() + "-ai", sender: "ai", text: "Respuesta simulada de la IA." };
      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 100);
    }
  };

  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={baseStyles.container}>
          <Text style={[baseStyles.title, { color: textColor }]}>Chat con IA</Text>

          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 6, alignSelf: item.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <Text style={{ backgroundColor: item.sender === "user" ? "#007AFF" : (darkMode ? "#e2e8f0" : "#eee"), color: item.sender === "user" ? "#fff" : "#000", padding: 10, borderRadius: 10 }}>
                  {item.text}
                </Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 12 }}
          />

          <TextInput
            style={[baseStyles.input, { backgroundColor: darkMode ? "#0b2740" : "#fff", color: textColor }]}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={darkMode ? "#9fb3c8" : "#999"}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Button title="Enviar" onPress={sendMessage} color={darkMode ? "#2E86AB" : undefined} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

