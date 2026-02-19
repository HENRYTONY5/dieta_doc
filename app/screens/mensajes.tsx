import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MensajesScreen() {
  const router = useRouter();

  const messages = [
    { id: 1, name: 'Juan Pérez', message: 'Hola, ¿cómo estás?', time: '10:30 AM' },
    { id: 2, name: 'María García', message: 'Nos vemos mañana', time: '9:15 AM' },
    { id: 3, name: 'Carlos López', message: 'Gracias por tu ayuda', time: 'Ayer' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mensajes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {messages.map((msg) => (
          <TouchableOpacity key={msg.id} style={styles.messageCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="#fff" />
            </View>
            <View style={styles.messageContent}>
              <Text style={styles.messageName}>{msg.name}</Text>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF9800',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  messageCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  messageContent: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
});
