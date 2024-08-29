// components/AnnouncementList.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';

const AnnouncementList = ({ announcements }) => (
  <FlatList
    data={announcements}
    keyExtractor={item => item.id}
    renderItem={({ item }) => (
      <View>
        <Text>{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    )}
  />
);

export default AnnouncementList;
