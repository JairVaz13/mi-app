import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, FlatList, Alert, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import GradientBackground from '../components/GradientBackground'; // Asegúrate de tener este componente

const ANUNCIOS_FILE = FileSystem.documentDirectory + 'anuncios.json';

export default function HacerAnuncioScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [anuncios, setAnuncios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const specialties = ['Danza', 'Musica', 'Artes Visuales', 'Artes Dramaticas'];

  useEffect(() => {
    const loadAnuncios = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(ANUNCIOS_FILE);
        const anunciosData = JSON.parse(fileContent);
        setAnuncios(anunciosData);
      } catch (error) {
        // Manejar si el archivo no existe o hay un error al leerlo
      }
    };

    loadAnuncios();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedSpecialty) {
      alert('Por favor completa todos los campos.');
      return;
    }

    try {
      const newAnuncio = {
        title,
        description,
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString(),
        specialty: selectedSpecialty,
      };

      const updatedAnuncios = [...anuncios, newAnuncio];
      await FileSystem.writeAsStringAsync(ANUNCIOS_FILE, JSON.stringify(updatedAnuncios));

      alert('Anuncio guardado exitosamente');
      setTitle('');
      setDescription('');
      setDate(new Date());
      setTime(new Date());
      setSelectedSpecialty('');
      setAnuncios(updatedAnuncios);
    } catch (error) {
      console.error('Error al guardar el anuncio:', error);
      alert('Error al guardar el anuncio');
    }
  };

  const handleDelete = async (index) => {
    try {
      const updatedAnuncios = anuncios.filter((_, i) => i !== index);
      await FileSystem.writeAsStringAsync(ANUNCIOS_FILE, JSON.stringify(updatedAnuncios));
      setAnuncios(updatedAnuncios);
      Alert.alert('Éxito', 'Anuncio eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el anuncio:', error);
      Alert.alert('Error', 'Error al eliminar el anuncio');
    }
  };

  const renderAnuncioItem = ({ item, index }) => (
    <View style={styles.anuncioItem}>
      <Text style={styles.anuncioTitle}>{item.title}</Text>
      <Text style={styles.anuncioDescription}>{item.description}</Text>
      <Text style={styles.anuncioDateTime}>Fecha: {item.date}</Text>
      <Text style={styles.anuncioDateTime}>Hora: {item.time}</Text>
      <Text style={styles.anuncioDateTime}>Especialidad: {item.specialty}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Hacer Anuncio</Text>

          <TextInput
            style={styles.input}
            placeholder="Título del Anuncio"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Descripción del Anuncio"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
            <Text style={styles.pickerText}>
              {selectedSpecialty || 'Selecciona una especialidad'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateTimeButtonText}>Fecha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateTimeButtonText}>Hora</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.dateTimeDisplay}>
            <Text style={styles.selectedDateTime}>Fecha seleccionada: {date.toLocaleDateString()}</Text>
            <Text style={styles.selectedDateTime}>Hora seleccionada: {time.toLocaleTimeString()}</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Anuncio</Text>
          </TouchableOpacity>

          <View style={styles.listContainer}>
            <Text style={styles.title}>Anuncios Guardados</Text>
            <FlatList
              data={anuncios}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAnuncioItem}
            />
          </View>
        </View>

        {/* Modal for selecting specialty */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {specialties.map((specialty, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedSpecialty(specialty);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{specialty}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  innerContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateTimeButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
  },
  dateTimeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateTimeDisplay: {
    marginBottom: 20,
  },
  selectedDateTime: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
  },
  anuncioItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  anuncioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  anuncioDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  anuncioDateTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
});
