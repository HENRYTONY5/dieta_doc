import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CalendarioScreen() {
  const router = useRouter();

  const events = [
    { id: 1, title: 'Reunión de proyecto', time: '10:00 AM', date: '22 Ene' },
    { id: 2, title: 'Presentación cliente', time: '2:00 PM', date: '22 Ene' },
    { id: 3, title: 'Revisión mensual', time: '11:00 AM', date: '23 Ene' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Calendario</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{event.date}</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
            </View>
          </View>
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
    backgroundColor: '#F44336',
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
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  dateBox: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
});
