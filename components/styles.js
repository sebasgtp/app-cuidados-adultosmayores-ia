// components/styles.js
import { StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    // Sin marginTop — usamos SafeAreaProvider para notch
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
});
