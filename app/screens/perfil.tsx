import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '@/config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface UserData {
  email: string;
  uid: string;
  nombre?: string;
  telefono?: string;
  edad?: number;
  rol?: string;
  fechaRegistro?: string;
}

export default function PerfilScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados para los campos editables
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      console.log('🔍 Iniciando carga de datos de usuario...');
      const user = auth.currentUser;
      console.log('👤 Usuario actual:', user?.email, user?.uid);
      
      if (!user) {
        console.log('❌ No hay usuario autenticado');
        Alert.alert('Error', 'No hay usuario autenticado');
        router.replace('/login');
        return;
      }

      console.log('📡 Buscando documento en Firestore:', user.uid);
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      console.log('📄 Documento existe:', userDoc.exists());
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        console.log('✅ Datos cargados:', data);
        setUserData(data);
        setNombre(data.nombre || '');
        setTelefono(data.telefono || '');
        setEdad(data.edad?.toString() || '');
      } else {
        console.log('⚠️ Documento no existe, creando datos básicos');
        // Si no existe el documento, crear uno básico
        setUserData({
          email: user.email || '',
          uid: user.uid,
        });
      }
    } catch (error: any) {
      console.error('❌ Error al cargar datos:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario: ' + error.message);
    } finally {
      console.log('✅ Finalizando carga, setLoading(false)');
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      setSaving(true);
      
      const datosActualizados: any = {
        email: user.email,
        uid: user.uid,
        nombre,
        telefono,
        edad: edad ? parseInt(edad) : null,
        fechaActualizacion: new Date().toISOString(),
      };

      // Usar setDoc con merge para crear o actualizar
      await setDoc(doc(db, 'usuarios', user.uid), datosActualizados, { merge: true });
      
      console.log('✅ Datos guardados correctamente');
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setIsEditing(false);
      cargarDatosUsuario();
    } catch (error: any) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCerrarSesion = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
          <Ionicons name={isEditing ? "close" : "create-outline"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={120} color="#4CAF50" />
        </View>

        {!isEditing ? (
          // Modo Vista
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={24} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData?.email || 'No disponible'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="person" size={24} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{userData?.nombre || 'No especificado'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call" size={24} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{userData?.telefono || 'No especificado'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={24} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>{userData?.edad || 'No especificada'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={24} color="#666" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Rol</Text>
                <Text style={styles.infoValue}>{userData?.rol || 'usuario'}</Text>
              </View>
            </View>

            {userData?.fechaRegistro && (
              <View style={styles.infoRow}>
                <Ionicons name="time" size={24} color="#666" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Fecha de Registro</Text>
                  <Text style={styles.infoValue}>
                    {new Date(userData.fechaRegistro).toLocaleDateString('es-ES')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          // Modo Edición
          <View style={styles.editContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Edad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu edad"
                value={edad}
                onChangeText={setEdad}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={guardarCambios}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    backgroundColor: '#4CAF50',
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
  editButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  infoContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
