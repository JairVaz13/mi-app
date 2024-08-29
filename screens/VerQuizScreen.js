import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from '../components/GradientBackground'; // Importar el componente
import * as FileSystem from 'expo-file-system';

const QuizListScreen = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const loadQuizzesFromFile = async () => {
    const path = FileSystem.documentDirectory + 'quiz.json';
    try {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(path);
        const quizData = JSON.parse(fileContent);
        setQuizzes([quizData]); // Assuming file contains a single quiz
      } else {
        Alert.alert('No hay cuestionarios guardados', 'Aún no has guardado ningún cuestionario.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el cuestionario.');
    }
  };

  useEffect(() => {
    loadQuizzesFromFile();
  }, []);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = () => {
    const results = quizzes[0].questions.map((question, index) => ({
      question: question.text,
      selectedAnswer: selectedAnswers[index] !== undefined ? question.options[selectedAnswers[index]] : 'No respondida',
    }));
    
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

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <FlatList
            data={quizzes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <FlatList
                data={item.questions}
                keyExtractor={(q, index) => index.toString()}
                renderItem={renderQuestion}
              />
            )}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuiz}>
            <Text style={styles.submitButtonText}>Enviar Respuestas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#4b0000', // Borde vino tinto
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b0000', // Color de texto vino tinto
    marginBottom: 8,
  },
  optionContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#4b0000', // Borde vino tinto para las opciones
    borderRadius: 4,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#4b0000', // Fondo vino tinto para la opción seleccionada
  },
  optionText: {
    fontSize: 14,
    color: '#000000', // Texto negro
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#ffffff', // Texto blanco para la opción seleccionada
  },
  submitButton: {
    backgroundColor: '#4b0000', // Botón de envío en color vino tinto
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff', // Texto del botón en blanco
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QuizListScreen;
