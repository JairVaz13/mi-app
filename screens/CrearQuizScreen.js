import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import GradientBackground from '../components/GradientBackground';

const CrearQuizScreen = ({ navigation }) => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('multiple');
  const [options, setOptions] = useState(['', '']);
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (correctAnswer === index) {
        setCorrectAnswer(null);
      }
    } else {
      Alert.alert('Mínimo dos opciones son necesarias.');
    }
  };

  const handleChangeOption = (text, index) => {
    const newOptions = options.slice();
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (questionText.trim() === '') {
      Alert.alert('Por favor, ingrese el texto de la pregunta.');
      return;
    }

    if (questionType === 'multiple' && options.length < 2) {
      Alert.alert('Por favor, agregue al menos dos opciones.');
      return;
    }

    if (questionType === 'multiple' && correctAnswer === null) {
      Alert.alert('Por favor, seleccione la respuesta correcta.');
      return;
    }

    const newQuestion = {
      text: questionText,
      type: questionType,
      options: questionType === 'multiple' ? options : [],
      correctAnswer: questionType === 'multiple' ? correctAnswer : null,
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setQuestionText('');
    setOptions(['', '']);
    setCorrectAnswer(null);
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setQuestionText(question.text);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);
    setQuestionType(question.type);
    setEditingIndex(index);
  };

  const handleDeleteQuestion = (index) => {
    Alert.alert(
      'Eliminar Pregunta',
      '¿Estás seguro de que quieres eliminar esta pregunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setQuestions(questions.filter((_, i) => i !== index));
          },
        },
      ],
    );
  };

  const createDefaultQuiz = async () => {
    const defaultQuiz = {
      title: 'Título por defecto',
      questions: [],
    };

    const path = FileSystem.documentDirectory + 'quiz.json';
    try {
      await FileSystem.writeAsStringAsync(path, JSON.stringify(defaultQuiz));
      console.log('Default quiz created.');
    } catch (error) {
      console.error('Error creating default quiz:', error);
    }
  };

  const saveQuizToFile = async (quiz) => {
    const path = FileSystem.documentDirectory + 'quiz.json';
    try {
      const fileExists = await FileSystem.getInfoAsync(path);
      if (!fileExists.exists) {
        await createDefaultQuiz();
      }
      await FileSystem.writeAsStringAsync(path, JSON.stringify(quiz));
      Alert.alert('Guardado', 'El quiz ha sido guardado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el quiz.');
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizTitle.trim() === '' || questions.length === 0) {
      Alert.alert('Por favor, ingrese el título del quiz y agregue al menos una pregunta.');
      return;
    }

    const quiz = {
      title: quizTitle,
      questions: questions,
    };

    await saveQuizToFile(quiz);
    navigation.navigate('ResultsScreen', { quiz });
    setQuizTitle('');
    setQuestions([]);
    setQuestionText('');
    setOptions(['', '']);
    setCorrectAnswer(null);
  };

  return (
    <LinearGradient colors={['#5d1f2f', '#3b1f2f']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título del Quiz:</Text>
            <TextInput
              style={styles.input}
              value={quizTitle}
              onChangeText={setQuizTitle}
              placeholder="Título del Quiz"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pregunta:</Text>
            <TextInput
              style={styles.input}
              value={questionText}
              onChangeText={setQuestionText}
              placeholder="Escribe la pregunta"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Opción Múltiple"
              onPress={() => setQuestionType('multiple')}
              color={questionType === 'multiple' ? '#5d1f2f' : '#3b1f2f'}
            />
          </View>

          {questionType === 'multiple' && (
            <View>
              <Text style={styles.label}>Opciones:</Text>
              {options.map((option, index) => (
                <View key={index} style={styles.optionContainer}>
                  <TextInput
                    style={styles.optionInput}
                    value={option}
                    onChangeText={(text) => handleChangeOption(text, index)}
                    placeholder={`Opción ${index + 1}`}
                  />
                  <TouchableOpacity
                    style={[styles.radioButton, correctAnswer === index && styles.radioButtonSelected]}
                    onPress={() => setCorrectAnswer(index)}
                  >
                    {correctAnswer === index && <View style={styles.innerRadioButton} />}
                  </TouchableOpacity>
                  <Button
                    title="Eliminar"
                    onPress={() => handleRemoveOption(index)}
                    color="red"
                  />
                </View>
              ))}
              <Button title="Agregar Opción" onPress={handleAddOption} />
            </View>
          )}

          <Button title={editingIndex !== null ? "Actualizar Pregunta" : "Agregar Pregunta"} onPress={handleAddQuestion} />

          <FlatList
            data={questions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.text}</Text>
                {item.type === 'multiple' && (
                  <FlatList
                    data={item.options}
                    keyExtractor={(option, index) => index.toString()}
                    renderItem={({ item: option, index: optionIndex }) => (
                      <Text style={styles.optionText}>
                        {option}
                        {item.correctAnswer === optionIndex && ' (Correcta)'}
                      </Text>
                    )}
                  />
                )}
                <View style={styles.actionButtons}>
                  <Button title="Editar" onPress={() => handleEditQuestion(index)} />
                  <Button title="Eliminar" onPress={() => handleDeleteQuestion(index)} color="red" />
                </View>
              </View>
            )}
          />

          <Button title="Enviar Quiz" onPress={handleSubmitQuiz} />
        </View>
      </ScrollView>
    </LinearGradient>
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5d1f2f',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#5d1f2f',
  },
  innerRadioButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5d1f2f',
  },
  questionContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default CrearQuizScreen;
