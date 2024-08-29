import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

const ListarContenidoScreen = ({ route, navigation }) => {
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const { specialty } = route.params;

  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const directoryUri = FileSystem.documentDirectory + 'multimedia/';
        const filesList = await FileSystem.readDirectoryAsync(directoryUri);
        const jsonFiles = filesList.filter(file => file.endsWith('.json'));

        const filesData = await Promise.all(jsonFiles.map(async (file) => {
          const fileUri = directoryUri + file;
          const fileContent = await FileSystem.readAsStringAsync(fileUri);
          const parsedContent = JSON.parse(fileContent);

          parsedContent.especialidad = normalizeString(parsedContent.especialidad || '');

          return { uri: fileUri, content: parsedContent };
        }));

        const normalizedSpecialty = normalizeString(specialty);
        const filteredFiles = filesData.filter(file => file.content.especialidad === normalizedSpecialty);

        setFiles(filteredFiles);
      } catch (error) {
        console.error('Error al cargar los archivos:', error);
        Alert.alert('Error', 'Error al cargar los archivos');
      }
    };

    fetchFiles();
  }, [specialty]);

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

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const renderFilePreview = (item) => {
    const { content } = item;
    const fileUri = content.archivo.uri;

    if (content.archivo.type.startsWith('image/')) {
      return (
        <TouchableOpacity onPress={() => handleImagePress(fileUri)}>
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
      <Text style={styles.title}>Lista de Contenidos</Text>
      <FlatList
        data={files}
        keyExtractor={item => item.uri}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {renderFilePreview(item)}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.content.titulo || 'Sin título'}</Text>
              <Text style={styles.cardDescription}>{item.content.descripcion || 'Sin descripción'}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <Button title="Volver" onPress={() => navigation.goBack()} color="#8B0000" />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} />}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    backgroundColor: '#8B0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default ListarContenidoScreen;
