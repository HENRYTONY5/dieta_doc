import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    { id: 1, title: 'Perfil', icon: 'person', color: '#4CAF50', route: '/screens/perfil' },
    { id: 2, title: 'Chat DeepSeek (Local)', icon: 'medical', color: '#F44336', route: '/screens/chat' },
    { id: 3, title: 'Mi Documentación', icon: 'bar-chart', color: '#2196F3', route: '/screens/reportes' },
    { id: 4, title: 'Entrenar Modelo', icon: 'school', color: '#9C27B0', route: '/screens/entrenamiento' },
    { id: 5, title: 'Docs primeros auxilios', icon: 'medkit-outline', color: '#FF9800', route: '/screens/mensajes' },
    { id: 6, title: 'Tareas', icon: 'checkbox', color: '#607D8B', route: '/screens/tareas' },
    { id: 7, title: 'Calendario', icon: 'calendar', color: '#00BCD4', route: '/screens/calendario' },
    { id: 8, title: 'Ajustes', icon: 'settings', color: '#455A64', route: '/screens/ajustes' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route as any)}
            >
              <Ionicons name={item.icon as any} size={40} color="#fff" />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
