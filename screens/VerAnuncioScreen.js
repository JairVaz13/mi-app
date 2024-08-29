import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

const ANUNCIOS_FILE = FileSystem.documentDirectory + 'anuncios.json';

// Función de normalización
const normalizeString = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');
};

const VerAnuncioScreen = ({ route }) => {
  const { specialty } = route.params;
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAnuncio, setExpandedAnuncio] = useState(null);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(ANUNCIOS_FILE);
        const data = JSON.parse(fileContent);

        console.log('Contenido del archivo JSON:', data);

        // Normaliza la especialidad recibida
        const normalizedSpecialty = normalizeString(specialty);
        console.log('Especialidad normalizada:', normalizedSpecialty);

        // Filtra los anuncios según la especialidad
        const filteredAnuncios = data.filter(anuncio => {
          // Normaliza la especialidad del anuncio
          const normalizedAnuncioSpecialty = normalizeString(anuncio.specialty);
          console.log('Especialidad del anuncio normalizada:', normalizedAnuncioSpecialty);
          return normalizedAnuncioSpecialty === normalizedSpecialty;
        });

        console.log('Anuncios filtrados:', filteredAnuncios);

        setAnuncios(filteredAnuncios);
      } catch (error) {
        console.error('Error al leer los anuncios:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();
  }, [specialty]);

  const toggleExpand = (title) => {
    setExpandedAnuncio(expandedAnuncio === title ? null : title);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>Error al cargar los anuncios: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {anuncios.length > 0 ? (
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.anuncio}>
              <TouchableOpacity onPress={() => toggleExpand(item.title)}>
                <Text style={styles.title}>{item.title}</Text>
                {expandedAnuncio === item.title && (
                  <View style={styles.details}>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.infoContainer}>
                      <Text style={styles.date}>{item.date}</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={styles.specialty}>{item.specialty}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noAnuncios}>No hay anuncios para esta especialidad.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  anuncio: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // Elevación para Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800020', // Color vino
    marginBottom: 8,
  },
  details: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  specialty: {
    fontSize: 14,
    color: '#ffd700', // Color dorado
    fontStyle: 'italic',
  },
  noAnuncios: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default VerAnuncioScreen;
