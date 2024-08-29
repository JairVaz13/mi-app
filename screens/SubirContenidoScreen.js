import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';
import { Picker } from '@react-native-picker/picker';

const SubirContenidoScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [archivoURI, setArchivoURI] = useState(null);
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [specialtyModalVisible, setSpecialtyModalVisible] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = ['Danza', 'Musica', 'Artes Visuales', 'Artes Dramaticas'];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const directoryUri = FileSystem.documentDirectory + 'multimedia/';
        const filesList = await FileSystem.readDirectoryAsync(directoryUri);
        const jsonFiles = filesList.filter(file => file.endsWith('.json'));

        const filesData = await Promise.all(jsonFiles.map(async (file) => {
          const fileUri = directoryUri + file;
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          return { uri: fileUri, content: JSON.parse(fileContent) };
        }));

        setFiles(filesData);
      } catch (error) {
        console.error('Error al cargar los archivos:', error);
        Alert.alert('Error', 'Error al cargar los archivos');
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setArchivo(result.assets[0]);
        setArchivoURI(result.assets[0].uri);
      } else {
        Alert.alert('Error', 'No se seleccionó ningún archivo');
      }
    } catch (error) {
      console.error('Error al seleccionar el archivo:', error);
      Alert.alert('Error', 'Error al seleccionar el archivo');
    }
  };

  const handleSave = async () => {
    if (!archivo || !archivo.uri) {
      Alert.alert('Error', 'Por favor selecciona un archivo.');
      return;
    }

    try {
      const fileName = archivo.uri.split('/').pop() || 'archivo';
      const data = {
        titulo,
        descripcion,
        especialidad: selectedSpecialty,
        archivo: {
          uri: archivo.uri,
          type: archivo.mimeType || 'application/octet-stream',
          name: fileName,
        },
      };

      const directoryUri = FileSystem.documentDirectory + 'multimedia/';
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileUri = directoryUri + `contenido-${timestamp}.json`;

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
      console.log('Contenido guardado exitosamente');
      Alert.alert('Éxito', 'Contenido guardado exitosamente');
      setArchivo(null);
      setArchivoURI(null);

      // Refresh the list of files
      const filesList = await FileSystem.readDirectoryAsync(directoryUri);
      const jsonFiles = filesList.filter(file => file.endsWith('.json'));

      const filesData = await Promise.all(jsonFiles.map(async (file) => {
        const fileUri = directoryUri + file;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        return { uri: fileUri, content: JSON.parse(fileContent) };
      }));

      setFiles(filesData);
    } catch (error) {
      console.error('Error al guardar el contenido:', error);
      Alert.alert('Error', 'Error al guardar el contenido');
    }
  };

  const handleDelete = async (fileUri) => {
    try {
      await FileSystem.deleteAsync(fileUri);
      setFiles(files.filter(file => file.uri !== fileUri));
      Alert.alert('Éxito', 'Archivo eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      Alert.alert('Error', 'Error al eliminar el archivo');
    }
  };

  const renderFilePreview = (item) => {
    const { content } = item;
    const fileUri = content.archivo.uri;

    if (content.archivo.type.startsWith('image/')) {
      return (
        <TouchableOpacity onPress={() => {
          setSelectedImageUri(fileUri);
          setModalVisible(true);
        }}>
          <Image source={{ uri: fileUri }} style={styles.imagePreview} />
        </TouchableOpacity>
      );
    }

    if (content.archivo.type.startsWith('video/')) {
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: fileUri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            useNativeControls
            style={styles.videoPreview}
          />
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Contenido</Text>
      <TextInput
        style={styles.input}
        placeholder="Título (Opcional)"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción (Opcional)"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TouchableOpacity style={styles.specialtyButton} onPress={() => setSpecialtyModalVisible(true)}>
        <Text style={styles.specialtyButtonText}>
          {selectedSpecialty ? selectedSpecialty : 'Selecciona una especialidad'}
        </Text>
      </TouchableOpacity>
      <Button title="Seleccionar Foto o Video" onPress={handleFileSelect} color="#5d1f2f" />
      {archivoURI && (
        <View style={styles.preview}>
          {archivo && archivo.mimeType?.startsWith('image/') && (
            <Image source={{ uri: archivoURI }} style={styles.imagePreview} />
          )}
          {archivo && archivo.mimeType?.startsWith('video/') && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: archivoURI }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                useNativeControls
                style={styles.videoPreview}
              />
            </View>
          )}
        </View>
      )}
      <Button title="Guardar Contenido" onPress={handleSave} color="#5d1f2f" />
      <Text style={styles.title}>Contenido Guardado</Text>
      <FlatList
        data={files}
        keyExtractor={item => item.uri}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {renderFilePreview(item)}
            <Text style={styles.cardTitle}>{item.content.titulo || 'Sin título'}</Text>
            <Text style={styles.cardDescription}>{item.content.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.cardDescription}>Especialidad: {item.content.especialidad || 'No especificada'}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.uri)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {/* Modal for image preview */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImageUri }} style={styles.modalImage} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {/* Modal for specialty selection */}
      <Modal
        visible={specialtyModalVisible}
        transparent={true}
        onRequestClose={() => setSpecialtyModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedSpecialty}
              onValueChange={(itemValue) => {
                setSelectedSpecialty(itemValue);
                setSpecialtyModalVisible(false);
              }}
            >
              <Picker.Item label="Selecciona una especialidad" value="" />
              {specialties.map((specialty) => (
                <Picker.Item key={specialty} label={specialty} value={specialty} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5d1f2f',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#5d1f2f',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    color: '#000000',
  },
  specialtyButton: {
    backgroundColor: '#5d1f2f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  specialtyButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  preview: {
    marginVertical: 10,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#5d1f2f',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d1f2f',
  },
  cardDescription: {
    fontSize: 14,
    color: '#000000',
  },
  deleteButton: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: 5,
  },
});

export default SubirContenidoScreen;
