import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente

const RoleSelectionScreen = ({ navigation }) => {
  const handleRoleSelection = (role) => {
    if (role === 'alumno') {
      navigation.navigate('SeleccionEspecialidadAlumnoScreen');
    } else if (role === 'profesor') {
      navigation.navigate('ProfesorLoginScreen');
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu Rol</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRoleSelection('alumno')}
        >
          <Text style={styles.buttonText}>Alumno</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRoleSelection('profesor')}
        >
          <Text style={styles.buttonText}>Profesor</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
};

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
    color: '#ffffff', // Blanco para resaltar el texto en el fondo oscuro
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000000', // Vino tinto oscuro para los botones
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff', // Blanco para el texto de los botones
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RoleSelectionScreen;
