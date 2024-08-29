import React from 'react';
import { View, Text } from 'react-native';

const ContentList = ({ content }) => {
  return (
    <View>
      {content.map((item) => (
        <View key={item.id}>
          <Text>{item.title}</Text>
          {/* Muestra más detalles del contenido aquí */}
        </View>
      ))}
    </View>
  );
};

export default ContentList;
