import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente

const SeleccionEspecialidadAlumnoScreen = ({ navigation }) => {
  const handleSelectSpecialty = (specialty) => {
    navigation.navigate('SeleccionTipoContenidoScreen', { specialty });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona tu Especialidad</Text>
        {['Danza', 'Música', 'Artes Visuales', 'Artes Dramáticas'].map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={styles.button}
            onPress={() => handleSelectSpecialty(specialty)}
          >
            <Text style={styles.buttonText}>{specialty}</Text>
          </TouchableOpacity>
        ))}
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
    color: '#ffffff', // Blanco para el texto del título
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

export default SeleccionEspecialidadAlumnoScreen;
