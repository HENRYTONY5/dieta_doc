import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ReportesScreen() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Documentación Chatbot</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Introducción */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={28} color="#2196F3" />
            <Text style={styles.sectionTitle}>¿Qué es DeepSeek?</Text>
          </View>
          <Text style={styles.sectionText}>
            DeepSeek es un modelo de IA similar a ChatGPT, pero 100% gratis y ejecutable localmente en tu computadora. No requiere internet después de descargarlo y toda la información se procesa de forma privada.
          </Text>
        </View>

        {/* Paso 1 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Instalar Ollama</Text>
          </View>
          <Text style={styles.stepDescription}>
            Ollama es el motor que ejecuta modelos de IA localmente.
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>Windows:</Text>
            <Text style={styles.code}>1. Descargar de: https://ollama.com/download</Text>
            <Text style={styles.code}>2. Ejecutar OllamaSetup.exe</Text>
            <Text style={styles.code}>3. Seguir el instalador</Text>
          </View>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => openLink('https://ollama.com/download')}
          >
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.linkButtonText}>Descargar Ollama</Text>
          </TouchableOpacity>
        </View>

        {/* Paso 2 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Descargar DeepSeek</Text>
          </View>
          <Text style={styles.stepDescription}>
            Después de instalar Ollama, abre PowerShell o Terminal y ejecuta:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>Modelo rápido (1.5B - 1.1GB):</Text>
            <Text style={styles.code}>ollama pull deepseek-r1:1.5b</Text>
            <Text style={styles.codeComment}># Respuestas rápidas, menos precisas</Text>
          </View>
          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>Modelo balanceado (7B - 4.7GB):</Text>
            <Text style={styles.code}>ollama pull deepseek-r1:7b</Text>
            <Text style={styles.codeComment}># Balance entre velocidad y precisión</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="time-outline" size={20} color="#FF9800" />
            <Text style={styles.infoText}>La descarga puede tomar 5-10 minutos según tu internet</Text>
          </View>
        </View>

        {/* Paso 3 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Verificar Instalación</Text>
          </View>
          <Text style={styles.stepDescription}>
            Verifica que Ollama esté funcionando:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama list</Text>
            <Text style={styles.codeComment}># Debe mostrar: deepseek-r1:1.5b o :7b</Text>
          </View>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama run deepseek-r1:1.5b "Hola"</Text>
            <Text style={styles.codeComment}># Prueba que el modelo funcione</Text>
          </View>
        </View>

        {/* Paso 4 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Configurar Servicio</Text>
          </View>
          <Text style={styles.stepDescription}>
            Crear archivo: services/ollamaService.ts
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>Configuración básica:</Text>
            <Text style={styles.code}>const OLLAMA_URL = 'http://localhost:11434';</Text>
            <Text style={styles.code}>const MODEL = 'deepseek-r1:1.5b';</Text>
          </View>
        </View>

        {/* Paso 5 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <Text style={styles.stepTitle}>Crear Pantalla de Chat</Text>
          </View>
          <Text style={styles.stepDescription}>
            Componentes necesarios:
          </Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>TextInput para mensajes</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>ScrollView para historial</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Función sendMessageToDeepSeek()</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Guardar en Firestore (opcional)</Text>
            </View>
          </View>
        </View>

        {/* Paso 6 */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>6</Text>
            </View>
            <Text style={styles.stepTitle}>Configurar Firebase (Opcional)</Text>
          </View>
          <Text style={styles.stepDescription}>
            Para guardar el historial de chat en la nube:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>Reglas de Firestore:</Text>
            <Text style={styles.code}>match /chats/{"{chatId}"} {"{"}</Text>
            <Text style={styles.code}>  allow read, write: if request.auth != null;</Text>
            <Text style={styles.code}>{"}"}</Text>
          </View>
        </View>

        {/* Características */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={28} color="#FF9800" />
            <Text style={styles.sectionTitle}>Características del Chatbot</Text>
          </View>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>100% privado y local</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cash-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Gratis sin límites</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="wifi-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>No requiere internet</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Conversaciones con contexto</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="save-outline" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Historial persistente</Text>
            </View>
          </View>
        </View>

        {/* Modelos disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics" size={28} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Modelos DeepSeek</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Modelo</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Tamaño</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>RAM</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>1.5B</Text>
              <Text style={styles.tableCell}>1.1 GB</Text>
              <Text style={styles.tableCell}>~2GB</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>7B</Text>
              <Text style={styles.tableCell}>4.7 GB</Text>
              <Text style={styles.tableCell}>~6GB</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>14B</Text>
              <Text style={styles.tableCell}>8 GB</Text>
              <Text style={styles.tableCell}>~10GB</Text>
            </View>
          </View>
        </View>

        {/* Arquitectura del Sistema */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers" size={28} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Arquitectura del Sistema</Text>
          </View>
          <Text style={styles.sectionText}>
            Nuestra aplicación está construida con tres componentes principales que trabajan juntos:
          </Text>

          {/* Frontend */}
          <View style={styles.archCard}>
            <View style={styles.archHeader}>
              <Ionicons name="phone-portrait" size={32} color="#2196F3" />
              <Text style={styles.archTitle}>Frontend</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="logo-react" size={20} color="#61DAFB" />
              <Text style={styles.archText}>React Native + Expo</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="navigate" size={20} color="#000" />
              <Text style={styles.archText}>Expo Router (navegación)</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="color-palette" size={20} color="#FF5722" />
              <Text style={styles.archText}>TypeScript + Ionicons</Text>
            </View>
          </View>

          {/* Backend/Autenticación */}
          <View style={styles.archCard}>
            <View style={styles.archHeader}>
              <Ionicons name="cloud" size={32} color="#FF9800" />
              <Text style={styles.archTitle}>Backend & Auth</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="flame" size={20} color="#FFCA28" />
              <Text style={styles.archText}>Firebase Authentication</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="server" size={20} color="#4CAF50" />
              <Text style={styles.archText}>Cloud Firestore (base de datos)</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="lock-closed" size={20} color="#F44336" />
              <Text style={styles.archText}>Reglas de seguridad</Text>
            </View>
          </View>

          {/* IA Local */}
          <View style={styles.archCard}>
            <View style={styles.archHeader}>
              <Ionicons name="bulb" size={32} color="#4CAF50" />
              <Text style={styles.archTitle}>Inteligencia Artificial</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="hardware-chip" size={20} color="#9C27B0" />
              <Text style={styles.archText}>Ollama (motor local)</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="chatbubbles" size={20} color="#2196F3" />
              <Text style={styles.archText}>DeepSeek R1 (modelo)</Text>
            </View>
            <View style={styles.archDetail}>
              <Ionicons name="speedometer" size={20} color="#FF5722" />
              <Text style={styles.archText}>API REST (localhost:11434)</Text>
            </View>
          </View>

          {/* Flujo de datos */}
          <View style={styles.flowContainer}>
            <Text style={styles.flowTitle}>📱 Flujo de Datos:</Text>
            <View style={styles.flowStep}>
              <View style={styles.flowDot} />
              <Text style={styles.flowText}>Usuario escribe mensaje → App</Text>
            </View>
            <View style={styles.flowStep}>
              <View style={styles.flowDot} />
              <Text style={styles.flowText}>App envía a Ollama (localhost)</Text>
            </View>
            <View style={styles.flowStep}>
              <View style={styles.flowDot} />
              <Text style={styles.flowText}>DeepSeek procesa y responde</Text>
            </View>
            <View style={styles.flowStep}>
              <View style={styles.flowDot} />
              <Text style={styles.flowText}>App guarda en Firebase (historial)</Text>
            </View>
            <View style={styles.flowStep}>
              <View style={styles.flowDot} />
              <Text style={styles.flowText}>Usuario ve respuesta en pantalla</Text>
            </View>
          </View>
        </View>

        {/* Código de Funciones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash" size={28} color="#00BCD4" />
            <Text style={styles.sectionTitle}>Funciones Principales</Text>
          </View>
          <Text style={styles.sectionText}>
            Estos son los componentes clave del código que hacen funcionar el sistema:
          </Text>

          {/* Función 1: Autenticación */}
          <View style={styles.codeSection}>
            <View style={styles.codeHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              <Text style={styles.codeLabel}>Firebase Authentication</Text>
            </View>
            <View style={styles.codeBlock}>
              <Text style={styles.codeComment}>// app/login.tsx</Text>
              <Text style={styles.codeLine}>const handleRegistro = async () {'{'}</Text>
              <Text style={styles.codeLine}>  await createUserWithEmailAndPassword(</Text>
              <Text style={styles.codeLine}>    auth, email, password</Text>
              <Text style={styles.codeLine}>  );</Text>
              <Text style={styles.codeLine}>  await setDoc(doc(db, 'usuarios', uid), {'{'}</Text>
              <Text style={styles.codeLine}>    email, nombre, createdAt</Text>
              <Text style={styles.codeLine}>  {'}'}, {'{'} merge: true {'}'});</Text>
              <Text style={styles.codeLine}>{'}'}</Text>
            </View>
          </View>

          {/* Función 2: Chat con Ollama */}
          <View style={styles.codeSection}>
            <View style={styles.codeHeader}>
              <Ionicons name="chatbox" size={20} color="#2196F3" />
              <Text style={styles.codeLabel}>Servicio Ollama</Text>
            </View>
            <View style={styles.codeBlock}>
              <Text style={styles.codeComment}>// services/ollamaService.ts</Text>
              <Text style={styles.codeLine}>export async function sendMessage(</Text>
              <Text style={styles.codeLine}>  message: string</Text>
              <Text style={styles.codeLine}>) {'{'}</Text>
              <Text style={styles.codeLine}>  const response = await fetch(</Text>
              <Text style={styles.codeLine}>    'http://localhost:11434/api/generate',</Text>
              <Text style={styles.codeLine}>    {'{'}</Text>
              <Text style={styles.codeLine}>      method: 'POST',</Text>
              <Text style={styles.codeLine}>      body: JSON.stringify({'{'}</Text>
              <Text style={styles.codeLine}>        model: 'deepseek-r1:1.5b',</Text>
              <Text style={styles.codeLine}>        prompt: message</Text>
              <Text style={styles.codeLine}>      {'}'})</Text>
              <Text style={styles.codeLine}>    {'}'}</Text>
              <Text style={styles.codeLine}>  );</Text>
              <Text style={styles.codeLine}>  return response.json();</Text>
              <Text style={styles.codeLine}>{'}'}</Text>
            </View>
          </View>

          {/* Función 3: Guardar en Firestore */}
          <View style={styles.codeSection}>
            <View style={styles.codeHeader}>
              <Ionicons name="save" size={20} color="#FF9800" />
              <Text style={styles.codeLabel}>Persistencia de Datos</Text>
            </View>
            <View style={styles.codeBlock}>
              <Text style={styles.codeComment}>// app/screens/chat.tsx</Text>
              <Text style={styles.codeLine}>const guardarMensaje = async (</Text>
              <Text style={styles.codeLine}>  texto: string, tipo: 'user' | 'ai'</Text>
              <Text style={styles.codeLine}>) {'{'}</Text>
              <Text style={styles.codeLine}>  await addDoc(collection(db, 'chats'), {'{'}</Text>
              <Text style={styles.codeLine}>    userId: auth.currentUser?.uid,</Text>
              <Text style={styles.codeLine}>    mensaje: texto,</Text>
              <Text style={styles.codeLine}>    tipo: tipo,</Text>
              <Text style={styles.codeLine}>    timestamp: serverTimestamp()</Text>
              <Text style={styles.codeLine}>  {'}'});</Text>
              <Text style={styles.codeLine}>{'}'}</Text>
            </View>
          </View>

          {/* Explicación técnica */}
          <View style={styles.techInfo}>
            <Ionicons name="information-circle" size={24} color="#9C27B0" />
            <View style={styles.techInfoText}>
              <Text style={styles.techInfoTitle}>¿Cómo funcionan juntos?</Text>
              <Text style={styles.techInfoDetail}>
                1. El usuario se autentica con Firebase Auth
              </Text>
              <Text style={styles.techInfoDetail}>
                2. La app valida el token y carga el perfil
              </Text>
              <Text style={styles.techInfoDetail}>
                3. Los mensajes del chat se envían a Ollama local
              </Text>
              <Text style={styles.techInfoDetail}>
                4. Las respuestas se guardan en Firestore
              </Text>
              <Text style={styles.techInfoDetail}>
                5. Todo sincroniza en tiempo real
              </Text>
            </View>
          </View>
        </View>

        {/* Recursos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="link" size={28} color="#F44336" />
            <Text style={styles.sectionTitle}>Recursos Útiles</Text>
          </View>
          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => openLink('https://ollama.com')}
          >
            <Ionicons name="globe-outline" size={24} color="#2196F3" />
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>Ollama Official</Text>
              <Text style={styles.resourceUrl}>ollama.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => openLink('https://github.com/deepseek-ai/DeepSeek-R1')}
          >
            <Ionicons name="logo-github" size={24} color="#333" />
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>DeepSeek GitHub</Text>
              <Text style={styles.resourceUrl}>github.com/deepseek-ai</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => openLink('https://console.firebase.google.com')}
          >
            <Ionicons name="flame-outline" size={24} color="#FF9800" />
            <View style={styles.resourceText}>
              <Text style={styles.resourceTitle}>Firebase Console</Text>
              <Text style={styles.resourceUrl}>console.firebase.google.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Botón para ir al chat */}
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push('/screens/chat')}
        >
          <Ionicons name="chatbox-ellipses" size={24} color="#fff" />
          <Text style={styles.chatButtonText}>Ir al Chat con DeepSeek</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Documentación creada: {new Date().toLocaleDateString('es-ES')}</Text>
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
    backgroundColor: '#2196F3',
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
    fontSize: 20,
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  stepDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  codeBlock: {
    backgroundColor: '#282c34',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  codeTitle: {
    fontSize: 13,
    color: '#61dafb',
    marginBottom: 8,
    fontWeight: '600',
  },
  code: {
    fontSize: 14,
    color: '#abb2bf',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  codeComment: {
    fontSize: 13,
    color: '#5c6370',
    fontFamily: 'monospace',
    fontStyle: 'italic',
    marginTop: 4,
  },
  linkButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  featureList: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resourceText: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resourceUrl: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#2e7d32',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Estilos de arquitectura
  archCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  archHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  archTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  archDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 6,
  },
  archText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#555',
  },
  flowContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  flowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  flowStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginRight: 10,
  },
  flowText: {
    fontSize: 13,
    color: '#1565C0',
    flex: 1,
  },
  // Estilos de código
  codeSection: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#263238',
    padding: 10,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  codeLine: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#B0BEC5',
    lineHeight: 18,
  },
  techInfo: {
    flexDirection: 'row',
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  techInfoText: {
    flex: 1,
    marginLeft: 10,
  },
  techInfoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 8,
  },
  techInfoDetail: {
    fontSize: 13,
    color: '#6A1B9A',
    marginBottom: 4,
    lineHeight: 20,
  },
});
