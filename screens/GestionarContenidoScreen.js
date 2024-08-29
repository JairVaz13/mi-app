import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Modal, Button, Dimensions, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const { height: screenHeight } = Dimensions.get('window');

export default function GestionarContenidoScreen() {
  const [selectedSection, setSelectedSection] = useState('videos');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers

  useEffect(() => {
    if (selectedSection === 'quizzes') {
      loadQuizzesFromFile();
    } else {
      setData([]);
    }
  }, [selectedSection]);

  const loadQuizzesFromFile = async () => {
    const fileUri = FileSystem.documentDirectory + 'quiz.json';
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert('No hay cuestionarios guardados', 'Aún no has guardado ningún cuestionario.');
        return;
      }

      const fileData = await FileSystem.readAsStringAsync(fileUri);
      const result = JSON.parse(fileData);
      setQuizzes(result.quizzes || []);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el cuestionario.');
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = data.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setData(filteredData);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
  };

  const handleUpdate = () => {
    const updatedData = data.map(item =>
      item.id === selectedItem.id ? { ...item, title: newTitle, description: newDescription } : item
    );
    setData(updatedData);
    setModalVisible(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = () => {
    const results = quizzes[0]?.questions?.map((question, index) => ({
      question: question.text,
      selectedAnswer: selectedAnswers[index] !== undefined ? question.options[selectedAnswers[index]] : 'No respondida',
      isCorrect: question.correctAnswerIndex === selectedAnswers[index], // Assuming 'correctAnswerIndex' holds the index of the correct answer
    })) || [];

    Alert.alert('Respuestas del Cuestionario', JSON.stringify(results, null, 2));
  };

  const renderQuestion = ({ item, index }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{item.text}</Text>
      {item.type === 'multiple' && (
        <FlatList
          data={item.options}
          keyExtractor={(option, idx) => idx.toString()}
          renderItem={({ item: option, index: optionIndex }) => (
            <TouchableOpacity
              style={[
                styles.optionContainer,
                selectedAnswers[index] === optionIndex && styles.optionSelected,
              ]}
              onPress={() => handleAnswerSelect(index, optionIndex)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswers[index] === optionIndex && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      {item.type === 'open' && (
        <Text style={styles.optionText}>Respuesta Abierta</Text>
      )}
    </View>
  );

  const renderContentItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        {selectedSection === 'quizzes' && item.questions && (
          <View style={styles.questionsContainer}>
            {item.questions.length > 0 ? (
              item.questions.map((question, questionIndex) => (
                <View key={question.id} style={styles.questionItem}>
                  <Text style={styles.questionText}>{question.text}</Text>
                  {question.type === 'multiple' && (
                    <View style={styles.optionsContainer}>
                      {question.options.map((option, optionIndex) => (
                        <Text key={optionIndex} style={styles.optionText}>- {option}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noQuestionsText}>No hay preguntas para este cuestionario.</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => {
            setSelectedItem(item);
            setNewTitle(item.title);
            setNewDescription(item.description);
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Gestionar Contenido</Text>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => handleSectionChange('videos')}
          >
            <Text style={styles.sectionButtonText}>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => handleSectionChange('audios')}
          >
            <Text style={styles.sectionButtonText}>Audios</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => handleSectionChange('documents')}
          >
            <Text style={styles.sectionButtonText}>Documentos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sectionButton}
            onPress={() => handleSectionChange('quizzes')}
          >
            <Text style={styles.sectionButtonText}>Quizzes</Text>
          </TouchableOpacity>
        </View>
        {selectedSection === 'quizzes' && (
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar contenido"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <FlatList
              data={data}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No hay datos para mostrar.</Text>}
            />
            <Button title="Enviar Respuestas" onPress={handleSubmitQuiz} />
          </>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Actualizar Contenido</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Título"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Descripción"
              multiline={true}
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <View style={styles.modalButtons}>
              <Button title="Actualizar" onPress={handleUpdate} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sectionButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  sectionButtonText: {
    fontSize: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  itemContent: {
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
  },
  questionsContainer: {
    marginTop: 10,
  },
  questionItem: {
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 5,
    paddingLeft: 10,
  },
  optionText: {
    fontSize: 14,
  },
  noQuestionsText: {
    fontSize: 14,
    color: '#888',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
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
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 14,
  },
  optionTextSelected: {
    fontWeight: 'bold',
  },
});
