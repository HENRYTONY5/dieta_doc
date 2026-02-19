import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  // Contador que empieza en 0
  const [contador, setContador] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Hola Mundo! </Text>
      
      <Text style={styles.texto}>Mi primer app con React Native</Text>
      
      <Text style={styles.numero}>{contador}</Text>
      
      <Button 
        title="Presioname" 
        onPress={() => setContador(contador + 1)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  texto: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
  },
  numero: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 30,
  },
});
