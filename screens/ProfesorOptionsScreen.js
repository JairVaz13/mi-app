// ProfesorOptionsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Asegúrate de tener este componente

export default function ProfesorOptionsScreen({ navigation }) {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Opciones del Profesor</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CrearQuizScreen')}
        >
          <Text style={styles.buttonText}>Crear Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SubirContenidoScreen')}
        >
          <Text style={styles.buttonText}>Subir Contenido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HacerAnuncioScreen')}
        >
         
          <Text style={styles.buttonText}>Hacer Anuncios</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000000',
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
    color: '#fff',
  },
});
