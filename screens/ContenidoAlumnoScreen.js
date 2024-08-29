// ContenidoAlumnoScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import GradientBackground from '../components/GradientBackground';

const ContenidoAlumnoScreen = ({ route }) => {
  const { specialty } = route.params;

  return (
    <View>
      <Text>Especialidad seleccionada: {specialty}</Text>
    </View>
  );
};

export default ContenidoAlumnoScreen;
