import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa todas las pantallas
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import ProfesorLoginScreen from './screens/ProfesorLoginScreen';
import ProfesorSpecialtyScreen from './screens/ProfesorSpecialtyScreen';
import ProfesorOptionsScreen from './screens/ProfesorOptionsScreen';
import AlumnoScreen from './screens/AlumnoScreen';
import SeleccionEspecialidadAlumnoScreen from './screens/SeleccionEspecialidadAlumnoScreen';
import SeleccionTipoContenidoScreen from './screens/SeleccionTipoContenidoScreen';
import ContenidoAlumnoScreen from './screens/ContenidoAlumnoScreen';
import CrearQuizScreen from './screens/CrearQuizScreen';
import SubirContenidoScreen from './screens/SubirContenidoScreen';
import HacerAnuncioScreen from './screens/HacerAnuncioScreen';
import GestionarContenidoScreen from './screens/GestionarContenidoScreen';
import VerAnuncioScreen from './screens/VerAnuncioScreen';
import VerContenidoScreen from './screens/VerContenidoScreen';
import VerQuizScreen from './screens/VerQuizScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelectionScreen">
        <Stack.Screen name="RoleSelectionScreen" component={RoleSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfesorLoginScreen" component={ProfesorLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfesorSpecialtyScreen" component={ProfesorSpecialtyScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfesorOptionsScreen" component={ProfesorOptionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AlumnoScreen" component={AlumnoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SeleccionEspecialidadAlumnoScreen" component={SeleccionEspecialidadAlumnoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SeleccionTipoContenidoScreen" component={SeleccionTipoContenidoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContenidoAlumnoScreen" component={ContenidoAlumnoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CrearQuizScreen" component={CrearQuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SubirContenidoScreen" component={SubirContenidoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HacerAnuncioScreen" component={HacerAnuncioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GestionarContenidoScreen" component={GestionarContenidoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerAnuncioScreen" component={VerAnuncioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerContenidoScreen" component={VerContenidoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerQuizScreen" component={VerQuizScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
