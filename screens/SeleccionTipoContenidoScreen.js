import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente

const SeleccionTipoContenidoScreen = ({ route, navigation }) => {
  const { specialty } = route.params;

  const handleViewContent = (type) => {
    navigation.navigate(type, { specialty });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Selecciona el Tipo de Contenido</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewContent('VerQuizScreen')}
        >
          <Text style={styles.buttonText}>Ver Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewContent('VerContenidoScreen')}
        >
          <Text style={styles.buttonText}>Ver Contenido</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleViewContent('VerAnuncioScreen')}
        >
          <Text style={styles.buttonText}>Ver Anuncios</Text>
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

export default SeleccionTipoContenidoScreen;
