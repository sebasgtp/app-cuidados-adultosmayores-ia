// screens/ChatScreen.js
import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert
} from "react-native";
import Constants from "expo-constants";
import { baseStyles } from "../components/styles";

const { width } = Dimensions.get('window');

export default function ChatScreen({ darkMode = false }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [quickReplies, setQuickReplies] = useState([
    "¿Cómo estás?",
    "Cuéntame sobre síntomas",
    "Consejos de salud",
    "Medicamentos",
    "Ejercicios"
  ]);
  const [savedChats, setSavedChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatRef = useRef(null);

  const bg = darkMode ? "#071B2E" : "#f8f9fa";
  const textColor = darkMode ? "#fff" : "#111";
  const cardBg = darkMode ? "#123455" : "#fff";
  const apiKey = Constants.expoConfig?.extra?.openaiApiKey || null;

  // Categorías de chat
  const chatCategories = ['General', 'Síntomas', 'Medicamentos', 'Ejercicio', 'Nutrición', 'Mental'];

  useEffect(() => {
    // Mensaje de bienvenida
    if (messages.length === 0) {
      const welcomeMsg = {
        id: 'welcome-' + Date.now(),
        sender: "ai",
        text: "¡Hola! Soy tu asistente de salud personal. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'General'
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  const sendMessage = async (customMessage = null) => {
    const msgText = customMessage || message;
    if (!msgText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: selectedCategory
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);
    setShowQuickReplies(false);

    // Scroll automático
    setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 100);

    // Si hay API key, llamamos a OpenAI; si no, respuesta simulada
    if (apiKey) {
      try {
        const systemPrompt = getSystemPromptByCategory(selectedCategory);
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMsg.text }
            ],
            max_tokens: 500,
            temperature: 0.7
          }),
        });

        const data = await resp.json();
        const reply = data?.choices?.[0]?.message?.content || "No obtuve respuesta.";
        const aiMsg = {
          id: Date.now().toString() + "-ai",
          sender: "ai",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: selectedCategory
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 200);
      } catch (err) {
        console.error(err);
        const errMsg = {
          id: Date.now().toString() + "-err",
          sender: "ai",
          text: "Error al conectar con la IA. Por favor, inténtalo de nuevo.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: selectedCategory
        };
        setMessages((prev) => [...prev, errMsg]);
        setIsTyping(false);
      }
    } else {
      // Respuesta simulada más inteligente
      setTimeout(() => {
        const simulatedReply = getSimulatedResponse(msgText, selectedCategory);
        const aiMsg = {
          id: Date.now().toString() + "-ai",
          sender: "ai",
          text: simulatedReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          category: selectedCategory
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        setTimeout(() => flatRef.current?.scrollToEnd?.({ animated: true }), 100);
      }, 1500);
    }
  };

  const getSystemPromptByCategory = (category) => {
    const prompts = {
      'General': 'Eres un asistente de salud amigable y profesional. Proporciona información general de salud y bienestar.',
      'Síntomas': 'Eres un asistente médico que ayuda a entender síntomas. Siempre recuerda que no reemplazas la consulta médica profesional.',
      'Medicamentos': 'Eres un asistente especializado en información de medicamentos. Proporciona información general pero siempre recomienda consultar con un profesional.',
      'Ejercicio': 'Eres un entrenador personal virtual especializado en salud y fitness. Proporciona consejos de ejercicio seguros.',
      'Nutrición': 'Eres un nutricionista virtual que proporciona consejos sobre alimentación saludable.',
      'Mental': 'Eres un asistente de bienestar mental que proporciona apoyo emocional y técnicas de relajación.'
    };
    return prompts[category] || prompts['General'];
  };

  const getSimulatedResponse = (userMessage, category) => {
    const responses = {
      'General': [
        'Es importante mantener hábitos saludables diarios. ¿Te gustaría que hablemos sobre algún aspecto específico?',
        'La salud integral incluye cuidar tanto el cuerpo como la mente. ¿En qué área te gustaría enfocar?'
      ],
      'Síntomas': [
        'Entiendo tu preocupación. Es importante consultar con un profesional médico para un diagnóstico adecuado.',
        'Los síntomas pueden tener múltiples causas. Te recomiendo agendar una cita médica para una evaluación completa.'
      ],
      'Medicamentos': [
        'Para información sobre medicamentos, siempre es mejor consultar con tu médico o farmacéutico.',
        'Recuerda seguir las indicaciones médicas y no automedicarte. ¿Tienes alguna duda específica?'
      ],
      'Ejercicio': [
        'El ejercicio regular es clave para una buena salud. ¿Qué tipo de actividad física te gusta más?',
        'Es importante comenzar gradualmente y escuchar a tu cuerpo. ¿Tienes alguna limitación física?'
      ],
      'Nutrición': [
        'Una alimentación equilibrada incluye variedad de nutrientes. ¿Te gustaría consejos sobre algún grupo alimenticio?',
        'La hidratación también es fundamental. ¿Mantienes un buen consumo de agua diario?'
      ],
      'Mental': [
        'Es normal tener altibajos emocionales. ¿Te gustaría que hablemos sobre técnicas de relajación?',
        'El bienestar mental es tan importante como la salud física. ¿Cómo te sientes hoy?'
      ]
    };

    const categoryResponses = responses[category] || responses['General'];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const saveCurrentChat = () => {
    if (messages.length > 1) {
      const chatTitle = messages[1]?.text.substring(0, 30) + '...' || 'Chat sin título';
      const savedChat = {
        id: Date.now().toString(),
        title: chatTitle,
        messages: messages,
        category: selectedCategory,
        timestamp: new Date().toLocaleString(),
        messagesCount: messages.length
      };
      setSavedChats(prev => [savedChat, ...prev]);
      Alert.alert('Chat Guardado', 'El chat ha sido guardado exitosamente');
    }
  };

  const startNewChat = () => {
    setMessages([{
      id: 'welcome-' + Date.now(),
      sender: "ai",
      text: "¡Hola! Soy tu asistente de salud personal. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'General'
    }]);
    setSelectedCategory('General');
    setShowQuickReplies(true);
    setCurrentChatId(null);
  };

  const CategorySelector = () => (
    <View style={styles.categorySection}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoryRow}>
          {chatCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryOption,
                {
                  backgroundColor: selectedCategory === category ? '#007AFF' : cardBg,
                  borderColor: selectedCategory === category ? '#007AFF' : textColor + '30'
                }
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

  const QuickReplies = () => (
    showQuickReplies && (
      <View style={styles.quickRepliesContainer}>
        <Text style={[styles.quickRepliesTitle, { color: textColor + '80' }]}>
          Respuestas rápidas:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickRepliesRow}>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickReplyOption, { backgroundColor: cardBg, borderColor: '#007AFF' + '40' }]}
                onPress={() => sendMessage(reply)}
              >
                <Text style={[styles.quickReplyText, { color: '#007AFF' }]}>
                  {reply}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  );

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      { alignSelf: item.sender === "user" ? "flex-end" : "flex-start" }
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.sender === "user" ? '#007AFF' : cardBg,
          borderColor: item.sender === "user" ? '#007AFF' : textColor + '20'
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.sender === "user" ? '#fff' : textColor }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTimestamp,
          { color: item.sender === "user" ? '#fff' : textColor + '60' }
        ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  const TypingIndicator = () => (
    isTyping && (
      <View style={[styles.messageContainer, { alignSelf: "flex-start" }]}>
        <View style={[styles.messageBubble, { backgroundColor: cardBg }]}>
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={[styles.typingText, { color: textColor + '80' }]}>
              Escribiendo...
            </Text>
          </View>
        </View>
      </View>
    )
  );

  return (
    <SafeAreaView style={[baseStyles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cardBg }]}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={[styles.menuIcon, { color: textColor }]}>☰</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: textColor }]}>Asistente IA</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
                onPress={saveCurrentChat}
              >
                <Text style={styles.actionButtonText}>💾</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#FFD700' }]}
                onPress={startNewChat}
              >
                <Text style={styles.actionButtonText}>✨</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Indicador de estado */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={[styles.statusText, { color: textColor + '80' }]}>
              Asistente disponible • {selectedCategory}
            </Text>
          </View>
        </View>

        <CategorySelector />

        {/* Chat Messages */}
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatRef.current?.scrollToEnd?.({ animated: true })}
          />
          <TypingIndicator />
        </View>

        <QuickReplies />

        {/* Input Section */}
        <View style={[styles.inputContainer, { backgroundColor: cardBg }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.textInput,
                { backgroundColor: bg, color: textColor, borderColor: textColor + '30' }
              ]}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor={textColor + '60'}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onFocus={() => setShowQuickReplies(false)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: message.trim() ? '#007AFF' : textColor + '30',
                  opacity: message.trim() ? 1 : 0.5
                }
              ]}
              onPress={() => sendMessage()}
              disabled={!message.trim() || isTyping}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>

          {/* Character Counter */}
          <Text style={[styles.characterCounter, { color: textColor + '60' }]}>
            {message.length}/500
          </Text>
        </View>

        {/* Stats Bar */}
        <View style={[styles.statsBar, { backgroundColor: cardBg }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#007AFF' }]}>
              {messages.filter(m => m.sender === 'user').length}
            </Text>
            <Text style={[styles.statLabel, { color: textColor + '80' }]}>Enviados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
              {messages.filter(m => m.sender === 'ai').length}
            </Text>
            <Text style={[styles.statLabel, { color: textColor + '80' }]}>Respuestas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#FFD700' }]}>
              {savedChats.length}
            </Text>
            <Text style={[styles.statLabel, { color: textColor + '80' }]}>Guardados</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categorySection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    fontSize: 13,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTimestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickRepliesTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickRepliesRow: {
    flexDirection: 'row',
  },
  quickReplyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterCounter: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});