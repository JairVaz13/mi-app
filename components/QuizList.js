// components/QuizList.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

const QuizList = ({ quizzes }) => (
  <FlatList
    data={quizzes}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    )}
  />
);

export default QuizList;
