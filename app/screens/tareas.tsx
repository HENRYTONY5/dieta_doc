import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TareasScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Revisar emails', completed: false },
    { id: 2, title: 'Llamar al cliente', completed: true },
    { id: 3, title: 'Actualizar documentación', completed: false },
    { id: 4, title: 'Reunión de equipo', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Tareas</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            style={styles.taskCard}
            onPress={() => toggleTask(task.id)}
          >
            <Ionicons 
              name={task.completed ? 'checkbox' : 'square-outline'} 
              size={28} 
              color={task.completed ? '#9C27B0' : '#ccc'} 
            />
            <Text style={[
              styles.taskTitle,
              task.completed && styles.taskCompleted
            ]}>
              {task.title}
            </Text>
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
    backgroundColor: '#9C27B0',
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
    padding: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
