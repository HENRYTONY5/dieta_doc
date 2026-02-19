import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addNewProtocol, getAllProtocols, initializeKnowledgeBase } from '@/services/knowledgeBase';
import { FirstAidProtocol } from '@/data/firstAidProtocols';

export default function EntrenamientoScreen() {
  const router = useRouter();
  const [protocols, setProtocols] = useState<FirstAidProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Formulario de nuevo protocolo
  const [nuevoProtocolo, setNuevoProtocolo] = useState({
    id: '',
    title: '',
    keywords: '',
    level: 'MODERADA' as 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE',
    stabilizationTime: '10',
    category: 'trauma' as any,
    description: '',
    symptoms: '',
    steps: '',
    warnings: '',
    whenToCall911: '',
  });

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = async () => {
    setIsLoading(true);
    try {
      const allProtocols = await getAllProtocols();
      setProtocols(allProtocols);
    } catch (error) {
      console.error('Error cargando protocolos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeKnowledge = async () => {
    Alert.alert(
      '🚀 Inicializar Base de Conocimiento',
      '¿Deseas cargar los 10 protocolos iniciales de primeros auxilios en Firebase?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cargar',
          onPress: async () => {
            setIsLoading(true);
            try {
              await initializeKnowledgeBase();
              await loadProtocols();
              Alert.alert('✅ Éxito', 'Base de conocimiento inicializada correctamente');
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo inicializar: ' + error);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Error al abrir el enlace", err));
  };

  const guardarNuevoProtocolo = async () => {
    // Validar campos requeridos
    if (!nuevoProtocolo.title || !nuevoProtocolo.description || !nuevoProtocolo.keywords) {
      Alert.alert('Error', 'Completa al menos: Título, Descripción y Palabras Clave');
      return;
    }

    setIsLoading(true);
    try {
      const protocol: FirstAidProtocol = {
        id: nuevoProtocolo.id || nuevoProtocolo.title.toLowerCase().replace(/\s+/g, '-'),
        title: nuevoProtocolo.title,
        keywords: nuevoProtocolo.keywords.split(',').map(k => k.trim()),
        level: nuevoProtocolo.level,
        stabilizationTime: parseInt(nuevoProtocolo.stabilizationTime) || 10,
        category: nuevoProtocolo.category,
        description: nuevoProtocolo.description,
        symptoms: nuevoProtocolo.symptoms.split('\n').filter(s => s.trim()),
        steps: nuevoProtocolo.steps.split('\n').filter(s => s.trim()),
        warnings: nuevoProtocolo.warnings.split('\n').filter(s => s.trim()),
        whenToCall911: nuevoProtocolo.whenToCall911.split('\n').filter(s => s.trim()),
        relatedConditions: []
      };

      await addNewProtocol(protocol);
      await loadProtocols();
      
      Alert.alert('✅ Éxito', 'Nuevo protocolo agregado correctamente');
      
      // Resetear formulario
      setNuevoProtocolo({
        id: '',
        title: '',
        keywords: '',
        level: 'MODERADA',
        stabilizationTime: '10',
        category: 'trauma',
        description: '',
        symptoms: '',
        steps: '',
        warnings: '',
        whenToCall911: '',
      });
      setShowAddForm(false);
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo guardar: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Entrenamiento del Modelo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Formulario para Agregar Nuevo Protocolo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="add-circle" size={28} color="#4CAF50" />
            <Text style={styles.sectionTitle}>✍️ Agregar Nuevo Caso</Text>
          </View>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>Entrena el modelo</Text> agregando nuevos casos de primeros auxilios que tú conoces.
          </Text>

          {!showAddForm ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.buttonText}>Agregar Nuevo Protocolo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.formContainer}>
              {/* Título */}
              <Text style={styles.label}>Título de la emergencia *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: Picadura de abeja"
                value={nuevoProtocolo.title}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, title: text})}
              />

              {/* Palabras Clave */}
              <Text style={styles.label}>Palabras clave (separadas por comas) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ej: picadura, abeja, hinchazón, dolor"
                value={nuevoProtocolo.keywords}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, keywords: text})}
              />

              {/* Descripción */}
              <Text style={styles.label}>Descripción breve *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="¿Qué es esta emergencia?"
                multiline
                numberOfLines={2}
                value={nuevoProtocolo.description}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, description: text})}
              />

              {/* Nivel */}
              <Text style={styles.label}>Nivel de emergencia</Text>
              <View style={styles.levelButtons}>
                {(['CRÍTICA', 'URGENTE', 'MODERADA', 'LEVE'] as const).map(nivel => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.levelButton,
                      nuevoProtocolo.level === nivel && styles.levelButtonActive,
                      { backgroundColor: getLevelColor(nivel) }
                    ]}
                    onPress={() => setNuevoProtocolo({...nuevoProtocolo, level: nivel})}
                  >
                    <Text style={styles.levelButtonText}>{nivel}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tiempo de estabilización */}
              <Text style={styles.label}>Tiempo de estabilización (minutos)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="10"
                keyboardType="numeric"
                value={nuevoProtocolo.stabilizationTime}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, stabilizationTime: text})}
              />

              {/* Síntomas */}
              <Text style={styles.label}>Síntomas (uno por línea)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Dolor en el área&#10;Hinchazón&#10;Enrojecimiento"
                multiline
                numberOfLines={4}
                value={nuevoProtocolo.symptoms}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, symptoms: text})}
              />

              {/* Pasos */}
              <Text style={styles.label}>Pasos a seguir (uno por línea)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Retirar el aguijón si está visible&#10;Lavar con agua y jabón&#10;Aplicar hielo"
                multiline
                numberOfLines={5}
                value={nuevoProtocolo.steps}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, steps: text})}
              />

              {/* Advertencias */}
              <Text style={styles.label}>Advertencias (uno por línea)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="NO apretar el área&#10;NO usar remedios caseros"
                multiline
                numberOfLines={3}
                value={nuevoProtocolo.warnings}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, warnings: text})}
              />

              {/* Cuándo llamar 911 */}
              <Text style={styles.label}>Cuándo llamar al 911 (uno por línea)</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Dificultad para respirar&#10;Hinchazón de garganta&#10;Reacción alérgica severa"
                multiline
                numberOfLines={3}
                value={nuevoProtocolo.whenToCall911}
                onChangeText={(text) => setNuevoProtocolo({...nuevoProtocolo, whenToCall911: text})}
              />

              {/* Botones */}
              <View style={styles.formButtons}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.formButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.saveButton]}
                  onPress={guardarNuevoProtocolo}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.formButtonText}>💾 Guardar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Sistema RAG */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="search" size={28} color="#FF5722" />
            <Text style={styles.sectionTitle}>🔥 Sistema RAG Activo</Text>
          </View>
          <Text style={styles.text}>
            La app ahora usa <Text style={styles.bold}>RAG (Retrieval-Augmented Generation)</Text> - busca información relevante antes de responder.
          </Text>
          
          <View style={styles.statsBox}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{protocols.length}</Text>
              <Text style={styles.statLabel}>Protocolos</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Árboles</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Escalable</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleInitializeKnowledge}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="download" size={20} color="#fff" />
                <Text style={styles.buttonText}>Inicializar Base de Conocimiento</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Protocolos Cargados */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={28} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Protocolos Disponibles</Text>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : protocols.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No hay protocolos cargados</Text>
              <Text style={styles.emptySubtext}>Usa el botón de arriba para inicializar</Text>
            </View>
          ) : (
            protocols.map((protocol, index) => (
              <View key={protocol.id} style={styles.protocolCard}>
                <View style={styles.protocolHeader}>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(protocol.level) }]}>
                    <Text style={styles.levelText}>{protocol.level}</Text>
                  </View>
                  <Text style={styles.protocolTime}>{protocol.stabilizationTime} min</Text>
                </View>
                <Text style={styles.protocolTitle}>{protocol.title}</Text>
                <Text style={styles.protocolDesc}>{protocol.description}</Text>
                <View style={styles.protocolKeywords}>
                  {protocol.keywords.slice(0, 5).map((keyword, i) => (
                    <View key={i} style={styles.keyword}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Cómo funciona Ollama localmente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip" size={28} color="#2196F3" />
            <Text style={styles.sectionTitle}>¿Cómo funciona sin internet?</Text>
          </View>
          <Text style={styles.text}>
            Ollama es un <Text style={styles.bold}>motor local</Text> que ejecuta modelos de IA directamente en tu computadora, sin necesidad de internet después de descargarlo.
          </Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="cloud-offline" size={24} color="#4CAF50" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>100% Local y Privado</Text>
              <Text style={styles.infoText}>
                • El modelo está descargado en tu PC (1-5 GB)
              </Text>
              <Text style={styles.infoText}>
                • Procesa todo en tu RAM y CPU/GPU
              </Text>
              <Text style={styles.infoText}>
                • No envía datos a internet
              </Text>
              <Text style={styles.infoText}>
                • Tus conversaciones son 100% privadas
              </Text>
            </View>
          </View>

          <Text style={styles.text}>
            Cuando escribes un mensaje, Ollama:
          </Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
              <Text style={styles.stepText}>Lee tu pregunta</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
              <Text style={styles.stepText}>Busca en el modelo descargado (no en internet)</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
              <Text style={styles.stepText}>Procesa con sus parámetros entrenados</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
              <Text style={styles.stepText}>Genera la respuesta en tu PC</Text>
            </View>
          </View>
        </View>

        {/* Base de conocimiento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="library" size={28} color="#9C27B0" />
            <Text style={styles.sectionTitle}>Base de conocimiento</Text>
          </View>
          <Text style={styles.text}>
            El modelo DeepSeek fue entrenado con <Text style={styles.bold}>billones de textos</Text> (libros, artículos científicos, manuales médicos, etc.) antes de descargarlo.
          </Text>
          <Text style={styles.text}>
            Nuestra app agrega <Text style={styles.bold}>conocimiento especializado</Text> de primeros auxilios mediante el "System Prompt" (instrucciones iniciales).
          </Text>

          <View style={styles.codeBlock}>
            <Text style={styles.codeTitle}>📝 System Prompt Actual:</Text>
            <Text style={styles.codeText}>
              • Base de conocimiento de 6 emergencias comunes{'\n'}
              • Dedo machucado, cortadas, quemaduras, etc.{'\n'}
              • Pasos específicos para cada situación{'\n'}
              • Tiempos de estabilización{'\n'}
              • Clasificación de niveles (CRÍTICA-LEVE)
            </Text>
          </View>
        </View>

        {/* Entrenamiento personalizado */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school" size={28} color="#FF9800" />
            <Text style={styles.sectionTitle}>Cómo entrenar más al modelo</Text>
          </View>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.methodTitle}>Método 1: Mejorar el System Prompt ✅</Text>
            </View>
            <Text style={styles.methodDesc}>
              <Text style={styles.bold}>Más fácil y efectivo</Text> para casos específicos.
            </Text>
            <Text style={styles.methodText}>
              • Agregar más ejemplos de emergencias{'\n'}
              • Incluir protocolos médicos actualizados{'\n'}
              • Añadir casos raros o específicos{'\n'}
              • Personalizar para tu región (números de emergencia, etc.)
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeComment}>// services/ollamaService.ts</Text>
              <Text style={styles.code}>const systemPrompt = `...</Text>
              <Text style={styles.code}>**PICADURA DE SERPIENTE:**</Text>
              <Text style={styles.code}>- Nivel: CRÍTICA</Text>
              <Text style={styles.code}>- Pasos: Inmovilizar, llamar 911...</Text>
              <Text style={styles.code}>`;</Text>
            </View>
          </View>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <Ionicons name="construct" size={24} color="#FF9800" />
              <Text style={styles.methodTitle}>Método 2: Fine-tuning (Avanzado) ⚙️</Text>
            </View>
            <Text style={styles.methodDesc}>
              <Text style={styles.bold}>Re-entrenar el modelo</Text> con tus propios datos médicos.
            </Text>
            <Text style={styles.methodText}>
              Requiere:{'\n'}
              • Crear dataset de preguntas y respuestas de emergencias{'\n'}
              • Usar herramientas como Ollama Modelfile{'\n'}
              • Computadora potente (GPU recomendada){'\n'}
              • Conocimientos técnicos de ML
            </Text>

            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color="#F57C00" />
              <Text style={styles.warningText}>
                Fine-tuning es complejo y puede tomar horas/días. Para primeros auxilios, mejorar el prompt es más práctico.
              </Text>
            </View>
          </View>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <Ionicons name="swap-horizontal" size={24} color="#2196F3" />
              <Text style={styles.methodTitle}>Método 3: Cambiar de modelo 🔄</Text>
            </View>
            <Text style={styles.methodText}>
              Puedes usar modelos especializados en medicina:{'\n'}
              • <Text style={styles.bold}>meditron</Text> (modelo médico específico){'\n'}
              • <Text style={styles.bold}>biomistral</Text> (medicina y biología){'\n'}
              • <Text style={styles.bold}>deepseek-r1:7b</Text> (más grande = más preciso)
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.codeComment}>// Cambiar en ollamaService.ts línea ~46</Text>
              <Text style={styles.code}>model: 'deepseek-r1:7b'  // o 'meditron'</Text>
            </View>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => openLink('https://ollama.com/library')}
            >
              <Ionicons name="globe" size={18} color="#fff" />
              <Text style={styles.linkText}>Ver modelos disponibles en Ollama</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={28} color="#FFD700" />
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="bulb" size={24} color="#FFC107" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Para mejorar respuestas ahora:</Text>
              <Text style={styles.tipText}>
                1. Edita el System Prompt en <Text style={styles.code}>ollamaService.ts</Text>{'\n'}
                2. Agrega casos específicos que te interesen{'\n'}
                3. Incluye protocolos de tu región{'\n'}
                4. Sé muy específico en las instrucciones
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="speedometer" size={24} color="#2196F3" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Para respuestas más precisas:</Text>
              <Text style={styles.tipText}>
                • Usa deepseek-r1:7b (más lento pero mejor){'\n'}
                • O descarga meditron (especializado en medicina){'\n'}
                • Proporciona más contexto en tus preguntas
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Recuerda siempre:</Text>
              <Text style={styles.tipText}>
                Esta app es para <Text style={styles.bold}>PRIMEROS AUXILIOS</Text>, no reemplaza atención médica profesional. Ante dudas, llama a emergencias.
              </Text>
            </View>
          </View>
        </View>

        {/* Comandos útiles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="terminal" size={28} color="#333" />
            <Text style={styles.sectionTitle}>Comandos útiles</Text>
          </View>

          <Text style={styles.commandTitle}>Ver modelos instalados:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama list</Text>
          </View>

          <Text style={styles.commandTitle}>Descargar modelo médico:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama pull meditron</Text>
          </View>

          <Text style={styles.commandTitle}>Cambiar a modelo más grande:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama pull deepseek-r1:14b</Text>
          </View>

          <Text style={styles.commandTitle}>Probar modelo en terminal:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>ollama run deepseek-r1:7b "¿Qué hacer con un dedo machucado?"</Text>
          </View>
        </View>

        {/* Recursos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book" size={28} color="#F44336" />
            <Text style={styles.sectionTitle}>Aprende más</Text>
          </View>

          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => openLink('https://github.com/ollama/ollama/blob/main/docs/modelfile.md')}
          >
            <Ionicons name="document-text" size={20} color="#2196F3" />
            <Text style={styles.resourceText}>Documentación de Modelfile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => openLink('https://ollama.com/library')}
          >
            <Ionicons name="library" size={20} color="#9C27B0" />
            <Text style={styles.resourceText}>Biblioteca de modelos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceButton}
            onPress={() => openLink('https://github.com/deepseek-ai/DeepSeek-R1')}
          >
            <Ionicons name="logo-github" size={20} color="#333" />
            <Text style={styles.resourceText}>DeepSeek en GitHub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function getLevelColor(level: string): string {
  switch (level) {
    case 'CRÍTICA': return '#F44336';
    case 'URGENTE': return '#FF9800';
    case 'MODERADA': return '#FFC107';
    case 'LEVE': return '#4CAF50';
    default: return '#9E9E9E';
  }
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
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  text: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#388E3C',
    marginBottom: 4,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  protocolCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  protocolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  protocolTime: {
    color: '#666',
    fontSize: 14,
  },
  protocolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  protocolDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  protocolKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keyword: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keywordText: {
    fontSize: 12,
    color: '#1976D2',
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  stepContainer: {
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  codeBlock: {
    backgroundColor: '#263238',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#B0BEC5',
    lineHeight: 20,
  },
  codeComment: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#66BB6A',
    marginBottom: 4,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#81C784',
  },
  methodCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  methodDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  methodText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    marginLeft: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  commandTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resourceText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  formContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0.6,
  },
  levelButtonActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#000',
  },
  levelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  formButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },});