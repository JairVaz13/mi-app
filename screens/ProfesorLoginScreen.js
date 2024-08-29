import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente

export default function ProfesorLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Validar los campos de entrada
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese todos los campos.');
      return;
    }

    // Simulación de autenticación (reemplazar con llamada a API real)
    if (email === 'bachilleratoenartes5@gmai1.com' && password === 'f$K:6LLMn2bD') {
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      navigation.navigate('ProfesorSpecialtyScreen'); // Navegar a la pantalla de selección de especialidad
    } else {
      Alert.alert('Error', 'Correo electrónico o contraseña incorrectos.');
    }
  };

  return (
    <GradientBackground>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Inicio de Sesión del Profesor</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4c669f',
  },
});
