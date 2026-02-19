import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendMessageToDeepSeek, checkOllamaStatus, detectEmergencyLevel, extractStabilizationTime } from '@/services/ollamaService';
import { getEnrichedPrompt, analyzeMessageCategory } from '@/services/knowledgeBase';
import { startDecisionTree, navigateTree, shouldStartNewTree, parseNumericAnswer } from '@/services/decisionTreeEngine';
import { DecisionTree } from '@/data/decisionTrees';
import { auth, db } from '@/config/firebase';
import { collection, addDoc, query, orderBy, getDocs, where } from 'firebase/firestore';
import Markdown from 'react-native-markdown-display';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

type EmergencyLevel = 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE' | null;

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  emergencyLevel?: EmergencyLevel;
  stabilizationTime?: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  // Estados de emergencia
  const [currentEmergency, setCurrentEmergency] = useState<EmergencyLevel>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [emergencyStartTime, setEmergencyStartTime] = useState<Date | null>(null);
  const timerRef = useRef<any>(null);
  
  // 🌳 Estados del árbol de decisión
  const [currentTree, setCurrentTree] = useState<DecisionTree | null>(null);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [inDecisionMode, setInDecisionMode] = useState(false);

  useEffect(() => {
    verificarOllama();
    cargarHistorial();
  }, []);

  // Temporizador de emergencia
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Tiempo agotado
            setTimerActive(false);
            if (currentEmergency === 'CRÍTICA' || currentEmergency === 'URGENTE') {
              Alert.alert(
                '⚠️ TIEMPO AGOTADO',
                'El tiempo de estabilización ha terminado. Si la condición no ha mejorado, LLAMA A EMERGENCIAS INMEDIATAMENTE.',
                [
                  { text: 'Llamar 911', onPress: () => llamarEmergencias(), style: 'destructive' },
                  { text: 'Continuar Monitoreando', style: 'cancel' }
                ]
              );
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, timeRemaining, currentEmergency]);

  const llamarEmergencias = () => {
    Alert.alert(
      '🚨 Llamando a Emergencias',
      '¿Deseas llamar al 911 ahora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Llamar 911',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:911').catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada. Marca manualmente al 911.');
            });
          }
        }
      ]
    );
  };

  const detenerTimer = () => {
    setTimerActive(false);
    setTimeRemaining(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const iniciarTimer = (minutos: number, nivel: EmergencyLevel) => {
    detenerTimer();
    setTimeRemaining(minutos * 60);
    setTimerActive(true);
    setCurrentEmergency(nivel);
    setEmergencyStartTime(new Date());
  };

  const verificarOllama = async () => {
    setCheckingStatus(true);
    const status = await checkOllamaStatus();
    setOllamaOnline(status);
    setCheckingStatus(false);
    
    if (!status) {
      Alert.alert(
        'Ollama no está corriendo',
        'No se pudo conectar con Ollama. Asegúrate de:\n\n1. Tener Ollama instalado\n2. Ejecutar "ollama serve" en terminal\n3. Tener el modelo deepseek-r1:1.5b descargado',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Intentar de nuevo', onPress: verificarOllama }
        ]
      );
    }
  };

  const cargarHistorial = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Query sin índice compuesto - cargar todos y filtrar en cliente
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const historial: ChatMessage[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        historial.push({
          id: doc.id,
          role: data.role,
          content: data.content,
          timestamp: data.timestamp?.toDate() || new Date(),
        });
      });

      // Ordenar en cliente por timestamp
      historial.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      setMessages(historial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // Si aún falla, mostrar alerta con instrucciones
      if (error instanceof Error && error.message.includes('index')) {
        Alert.alert(
          'Índice de Firebase Requerido',
          'Necesitas crear un índice en Firebase. Abre la app web en Chrome y copia el link que aparece en la consola, o contacta al desarrollador.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const guardarMensajeEnFirestore = async (message: Message) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'chats'), {
        userId: user.uid,
        role: message.role,
        content: message.content,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }
  };

  const enviarMensaje = async () => {
    if (!inputText.trim() || isLoading) return;
    
    // Verificar conexión pero permitir enviar de todos modos
    if (!ollamaOnline) {
      Alert.alert(
        'Ollama no disponible', 
        'Ollama no está corriendo. Asegúrate de tener "ollama serve" ejecutándose.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reintentar', onPress: verificarOllama }
        ]
      );
      return;
    }

    await proceedWithMessage();
  };

  const proceedWithMessage = async () => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    guardarMensajeEnFirestore(userMessage);
    const userInput = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      let respuesta: string;
      
      // 🌳 MODO ÁRBOL DE DECISIÓN
      if (inDecisionMode && currentTree && currentNodeId) {
        console.log('🌳 Navegando árbol de decisión...');
        
        // Navegar en el árbol actual
        const navigation = await navigateTree(currentTree, currentNodeId, userInput);
        
        respuesta = navigation.formattedResponse;
        
        if (navigation.isComplete) {
          // Llegamos al final del árbol
          console.log('✅ Árbol completado - protocolo:', navigation.protocolId);
          setInDecisionMode(false);
          setCurrentTree(null);
          setCurrentNodeId(null);
        } else {
          // Continuar en el árbol
          setCurrentNodeId(navigation.currentNode.id);
        }
        
        // Detectar nivel de emergencia del nodo
        const emergencyLevel = navigation.currentNode.level || null;
        const stabilizationTime = navigation.currentNode.type === 'protocol' ? 10 : 0;
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: respuesta,
          timestamp: new Date(),
          emergencyLevel: emergencyLevel,
          stabilizationTime: stabilizationTime || undefined,
        };

        setMessages(prev => [...prev, assistantMessage]);
        guardarMensajeEnFirestore(assistantMessage);
        
        // Iniciar timer si es emergencia
        if (emergencyLevel && emergencyLevel !== 'LEVE') {
          iniciarTimer(stabilizationTime, emergencyLevel);
        }
        
      } else {
        // 🌳 INTENTAR INICIAR ÁRBOL DE DECISIÓN
        const treeNavigation = await startDecisionTree(userInput);
        
        if (treeNavigation) {
          console.log('🌳 Iniciando árbol de decisión:', treeNavigation.tree.name);
          
          // Activar modo árbol
          setInDecisionMode(true);
          setCurrentTree(treeNavigation.tree);
          setCurrentNodeId(treeNavigation.currentNode.id);
          
          respuesta = `🌳 **MODO GUIADO ACTIVADO**\n\n`;
          respuesta += `Te guiaré con preguntas específicas para **${treeNavigation.tree.name}**.\n\n`;
          respuesta += `---\n\n${treeNavigation.formattedResponse}`;
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: respuesta,
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, assistantMessage]);
          guardarMensajeEnFirestore(assistantMessage);
          
        } else {
          // 🔍 MODO RAG NORMAL (sin árbol de decisión)
          console.log('💬 Usando modo RAG estándar');
          
          // Analizar categoría del mensaje
          const analysis = analyzeMessageCategory(userInput);
          console.log('📊 Análisis de mensaje:', analysis);

          // Obtener prompt enriquecido con RAG
          const enrichedMessage = await getEnrichedPrompt(userInput);
          console.log('✨ Usando RAG para enriquecer contexto');

          // Obtener historial para contexto (últimos 5 mensajes)
          const conversationHistory = messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content,
          }));

          // Enviar mensaje enriquecido al chatbot (usando DeepSeek/Ollama)
          respuesta = await sendMessageToDeepSeek(enrichedMessage, conversationHistory);

          // Detectar nivel de emergencia y tiempo
          const emergencyLevel = detectEmergencyLevel(respuesta);
          const stabilizationTime = extractStabilizationTime(respuesta);

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: respuesta,
            timestamp: new Date(),
            emergencyLevel: emergencyLevel,
            stabilizationTime: stabilizationTime || undefined,
          };

          setMessages(prev => [...prev, assistantMessage]);
          guardarMensajeEnFirestore(assistantMessage);

          // Iniciar temporizador si hay tiempo de estabilización
          if (emergencyLevel && stabilizationTime) {
            iniciarTimer(stabilizationTime, emergencyLevel);
            
            // Alerta inmediata para emergencias críticas
            if (emergencyLevel === 'CRÍTICA') {
              Alert.alert(
                '🚨 EMERGENCIA CRÍTICA',
                `Se ha detectado una emergencia crítica. Temporizador iniciado: ${stabilizationTime} minutos.\n\n¿Deseas llamar a emergencias ahora?`,
                [
                  { text: 'Seguir instrucciones', style: 'cancel' },
                  { text: 'Llamar 911', onPress: () => llamarEmergencias(), style: 'destructive' }
                ]
              );
            } else if (emergencyLevel === 'URGENTE') {
              Alert.alert(
                '⚠️ EMERGENCIA URGENTE',
                `Temporizador iniciado: ${stabilizationTime} minutos. Si la situación no mejora, llama a emergencias.`,
                [{ text: 'Entendido' }]
              );
            }
          }
        }
      }

      // Scroll al final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo obtener respuesta de Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  const limpiarChat = () => {
    Alert.alert(
      'Limpiar Chat',
      '¿Estás seguro de que quieres borrar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            setMessages([]);
            setInDecisionMode(false);
            setCurrentTree(null);
            setCurrentNodeId(null);
          },
        },
      ]
    );
  };

  if (checkingStatus) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Chat DeepSeek</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Verificando conexión...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Primeros Auxilios AI</Text>
          <View style={[styles.statusDot, ollamaOnline ? styles.online : styles.offline]} />
        </View>
        <TouchableOpacity onPress={limpiarChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Indicador de Modo Árbol de Decisión */}
      {inDecisionMode && currentTree && (
        <View style={styles.decisionModeIndicator}>
          <Ionicons name="git-branch" size={20} color="#FF5722" />
          <Text style={styles.decisionModeText}>
            🌳 Modo Guiado: {currentTree.name}
          </Text>
        </View>
      )}

      {/* Panel de Emergencia */}
      {currentEmergency && (
        <View style={[
          styles.emergencyPanel,
          currentEmergency === 'CRÍTICA' && styles.emergencyCritical,
          currentEmergency === 'URGENTE' && styles.emergencyUrgent,
          currentEmergency === 'MODERADA' && styles.emergencyModerate,
          currentEmergency === 'LEVE' && styles.emergencyMild,
        ]}>
          <View style={styles.emergencyHeader}>
            <Ionicons 
              name={currentEmergency === 'CRÍTICA' ? 'alert-circle' : currentEmergency === 'URGENTE' ? 'warning' : 'information-circle'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.emergencyTitle}>NIVEL: {currentEmergency}</Text>
          </View>
          
          {timerActive && timeRemaining > 0 && (
            <View style={styles.timerContainer}>
              <Ionicons name="timer" size={20} color="#fff" />
              <Text style={styles.timerText}>
                Tiempo restante: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}

          <View style={styles.emergencyActions}>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={llamarEmergencias}
            >
              <Ionicons name="call" size={18} color="#fff" />
              <Text style={styles.emergencyButtonText}>Llamar 911</Text>
            </TouchableOpacity>
            {timerActive && (
              <TouchableOpacity 
                style={[styles.emergencyButton, styles.stopButton]}
                onPress={detenerTimer}
              >
                <Ionicons name="stop-circle" size={18} color="#fff" />
                <Text style={styles.emergencyButtonText}>Detener</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Asistente de Primeros Auxilios</Text>
            <Text style={styles.emptySubtext}>Describe la emergencia para recibir ayuda inmediata</Text>
            <View style={styles.examplesContainer}>
              <Text style={styles.exampleTitle}>Ejemplos:</Text>
              <Text style={styles.example}>• "Persona inconsciente no respira"</Text>
              <Text style={styles.example}>• "Herida con sangrado abundante"</Text>
              <Text style={styles.example}>• "Quemadura en el brazo"</Text>
            </View>
          </View>
        ) : (
          messages.map((message) => (
            <View key={message.id}>
              {message.emergencyLevel && (
                <View style={[
                  styles.emergencyBadge,
                  message.emergencyLevel === 'CRÍTICA' && styles.badgeCritical,
                  message.emergencyLevel === 'URGENTE' && styles.badgeUrgent,
                  message.emergencyLevel === 'MODERADA' && styles.badgeModerate,
                  message.emergencyLevel === 'LEVE' && styles.badgeMild,
                ]}>
                  <Ionicons name="medical" size={14} color="#fff" />
                  <Text style={styles.badgeText}>{message.emergencyLevel}</Text>
                  {message.stabilizationTime && (
                    <Text style={styles.badgeTime}> • {message.stabilizationTime} min</Text>
                  )}
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' ? (
                  <Markdown style={markdownStyles}>
                    {message.content}
                  </Markdown>
                ) : (
                  <Text style={[
                    styles.messageText,
                    styles.userText,
                  ]}>
                    {message.content}
                  </Text>
                )}
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
          ))
        )}

        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>DeepSeek está pensando...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe la emergencia..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading}
          onSubmitEditing={enviarMensaje}
          blurOnSubmit={false}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={enviarMensaje}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons 
            name={isLoading ? "hourglass-outline" : "send"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#f44336',
  },
  clearButton: {
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  // Estilos de emergencia
  emergencyPanel: {
    padding: 15,
    borderBottomWidth: 3,
  },
  emergencyCritical: {
    backgroundColor: '#D32F2F',
    borderBottomColor: '#B71C1C',
  },
  emergencyUrgent: {
    backgroundColor: '#F57C00',
    borderBottomColor: '#E65100',
  },
  emergencyModerate: {
    backgroundColor: '#FBC02D',
    borderBottomColor: '#F9A825',
  },
  emergencyMild: {
    backgroundColor: '#388E3C',
    borderBottomColor: '#2E7D32',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 10,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 8,
    gap: 5,
  },
  stopButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
    gap: 5,
  },
  badgeCritical: {
    backgroundColor: '#D32F2F',
  },
  badgeUrgent: {
    backgroundColor: '#F57C00',
  },
  badgeModerate: {
    backgroundColor: '#FBC02D',
  },
  badgeMild: {
    backgroundColor: '#388E3C',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badgeTime: {
    color: '#fff',
    fontSize: 11,
  },
  decisionModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    margin: 15,
    marginBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  decisionModeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5722',
    marginLeft: 8,
  },
  examplesContainer: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  example: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
});

// Estilos de Markdown para mensajes del asistente
const markdownStyles = {
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  strong: {
    fontWeight: '700' as const,
    color: '#000',
  },
  heading1: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#333',
    marginBottom: 6,
  },
  list_item: {
    marginBottom: 4,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
};
