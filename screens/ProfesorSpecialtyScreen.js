import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente

export default function ProfesorSpecialtyScreen({ navigation }) {
  const handleSpecialtySelect = (specialty) => {
    // Navega a la pantalla de opciones del profesor después de seleccionar una especialidad
    navigation.navigate('ProfesorOptionsScreen');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu Especialidad</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSpecialtySelect('Danza')}
        >
          <Text style={styles.buttonText}>Danza</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSpecialtySelect('Música')}
        >
          <Text style={styles.buttonText}>Música</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSpecialtySelect('Artes Visuales')}
        >
          <Text style={styles.buttonText}>Artes Visuales</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSpecialtySelect('Artes Dramáticas')}
        >
          <Text style={styles.buttonText}>Artes Dramáticas</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000000', // Color vino tinto
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // Mantiene el texto blanco para un buen contraste
  },
});
