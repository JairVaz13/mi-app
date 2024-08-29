// PDFViewer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf'; // Asegúrate de que `react-native-pdf` está correctamente instalado

export default function PDFViewer({ uri }) {
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: uri, cache: true }}
        onError={(error) => {
          console.log('Error al cargar PDF:', error);
        }}
        style={styles.pdf}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
});
