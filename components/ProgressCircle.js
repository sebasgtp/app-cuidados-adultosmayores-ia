import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const ProgressCircle = ({ progress, label }) => {
  const data = {
    labels: [label], // nombre del indicador
    data: [progress], // valor entre 0 y 1
  };

  return (
    <View style={styles.container}>
      <ProgressChart
        data={data}
        width={screenWidth - 80}
        height={150}
        strokeWidth={12}
        radius={60}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        }}
        hideLegend={false}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10, backgroundColor: "#fff", borderRadius: 12, padding: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  label: { marginTop: 10, fontWeight: "bold", fontSize: 16, color: "#007AFF" },
});

export default ProgressCircle;
