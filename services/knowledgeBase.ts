// Servicio RAG (Retrieval-Augmented Generation) para primeros auxilios
// Busca información relevante y la integra con el chatbot

import { db } from '@/config/firebase';
import { FirstAidProtocol, firstAidProtocols, searchProtocols } from '@/data/firstAidProtocols';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

/**
 * Inicializa la base de conocimiento en Firestore
 * Se ejecuta una vez para cargar los protocolos iniciales
 */
export async function initializeKnowledgeBase(): Promise<void> {
  try {
    const knowledgeRef = collection(db, 'firstAidKnowledge');
    
    for (const protocol of firstAidProtocols) {
      await setDoc(doc(knowledgeRef, protocol.id), protocol);
    }
    
    console.log('✅ Base de conocimiento inicializada con', firstAidProtocols.length, 'protocolos');
  } catch (error) {
    console.error('❌ Error al inicializar base de conocimiento:', error);
    throw error;
  }
}

/**
 * Busca protocolos relevantes basados en el mensaje del usuario
 */
export async function searchRelevantProtocols(userMessage: string): Promise<FirstAidProtocol[]> {
  try {
    // Búsqueda local primero (más rápida)
    const localResults = searchProtocols(userMessage);
    
    if (localResults.length > 0) {
      return localResults.slice(0, 3); // Top 3 más relevantes
    }
    
    // Si no hay resultados locales, buscar en Firebase
    const knowledgeRef = collection(db, 'firstAidKnowledge');
    const snapshot = await getDocs(knowledgeRef);
    
    const allProtocols: FirstAidProtocol[] = [];
    snapshot.forEach(doc => {
      allProtocols.push(doc.data() as FirstAidProtocol);
    });
    
    // Búsqueda simple por palabras clave
    const searchTerms = userMessage.toLowerCase().split(' ');
    const results = allProtocols.filter(protocol => {
      const searchableText = [
        ...protocol.keywords,
        protocol.title,
        ...protocol.symptoms
      ].join(' ').toLowerCase();
      
      return searchTerms.some(term => searchableText.includes(term));
    });
    
    return results.slice(0, 3);
  } catch (error) {
    console.error('❌ Error al buscar protocolos:', error);
    return [];
  }
}

/**
 * Genera el contexto enriquecido para el chatbot con información relevante
 */
export function buildEnrichedContext(
  userMessage: string,
  relevantProtocols: FirstAidProtocol[]
): string {
  if (relevantProtocols.length === 0) {
    return '';
  }
  
  let context = '\n\n📚 INFORMACIÓN RELEVANTE DE LA BASE DE CONOCIMIENTO:\n\n';
  
  for (const protocol of relevantProtocols) {
    context += `**${protocol.title.toUpperCase()}**\n`;
    context += `- Nivel: ${protocol.level}\n`;
    context += `- Tiempo de estabilización: ${protocol.stabilizationTime} minutos\n`;
    context += `- Descripción: ${protocol.description}\n\n`;
    
    context += `**Síntomas:**\n`;
    protocol.symptoms.forEach(symptom => {
      context += `  • ${symptom}\n`;
    });
    
    context += `\n**Pasos a seguir:**\n`;
    protocol.steps.forEach((step, index) => {
      context += `  ${index + 1}. ${step}\n`;
    });
    
    context += `\n**⚠️ Advertencias:**\n`;
    protocol.warnings.forEach(warning => {
      context += `  • ${warning}\n`;
    });
    
    context += `\n**🚨 Cuándo llamar al 911:**\n`;
    protocol.whenToCall911.forEach(condition => {
      context += `  • ${condition}\n`;
    });
    
    context += '\n---\n\n';
  }
  
  return context;
}

/**
 * Función principal RAG: busca información y genera prompt enriquecido
 */
export async function getEnrichedPrompt(userMessage: string): Promise<string> {
  try {
    // 1. Buscar protocolos relevantes
    const relevantProtocols = await searchRelevantProtocols(userMessage);
    
    // 2. Construir contexto enriquecido
    const enrichedContext = buildEnrichedContext(userMessage, relevantProtocols);
    
    // 3. Combinar con el mensaje original
    return enrichedContext + `\n\n**PREGUNTA DEL USUARIO:** ${userMessage}`;
  } catch (error) {
    console.error('❌ Error en RAG:', error);
    return userMessage; // Fallback al mensaje original
  }
}

/**
 * Agregar un nuevo protocolo a la base de conocimiento
 */
export async function addNewProtocol(protocol: FirstAidProtocol): Promise<void> {
  try {
    const knowledgeRef = collection(db, 'firstAidKnowledge');
    await setDoc(doc(knowledgeRef, protocol.id), protocol);
    console.log('✅ Nuevo protocolo agregado:', protocol.title);
  } catch (error) {
    console.error('❌ Error al agregar protocolo:', error);
    throw error;
  }
}

/**
 * Obtener todos los protocolos de la base de conocimiento
 */
export async function getAllProtocols(): Promise<FirstAidProtocol[]> {
  try {
    const knowledgeRef = collection(db, 'firstAidKnowledge');
    const snapshot = await getDocs(knowledgeRef);
    
    const protocols: FirstAidProtocol[] = [];
    snapshot.forEach(doc => {
      protocols.push(doc.data() as FirstAidProtocol);
    });
    
    return protocols;
  } catch (error) {
    console.error('❌ Error al obtener protocolos:', error);
    return [];
  }
}

/**
 * Obtener protocolo por ID
 */
export async function getProtocolById(id: string): Promise<FirstAidProtocol | null> {
  try {
    // Buscar primero en los datos locales
    const localProtocol = firstAidProtocols.find(p => p.id === id);
    if (localProtocol) {
      return localProtocol;
    }
    
    // Si no está local, buscar en Firebase
    const knowledgeRef = collection(db, 'firstAidKnowledge');
    const snapshot = await getDocs(query(knowledgeRef, where('id', '==', id)));
    
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as FirstAidProtocol;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al obtener protocolo:', error);
    return null;
  }
}

/**
 * Analizar el mensaje y sugerir categorías
 */
export function analyzeMessageCategory(message: string): {
  category: string;
  confidence: number;
  suggestedKeywords: string[];
} {
  const messageLower = message.toLowerCase();
  
  // Palabras clave por categoría
  const categoryKeywords = {
    trauma: ['golpe', 'caída', 'cortada', 'herida', 'fractura', 'sangrado', 'dedo', 'hueso'],
    respiratorio: ['respirar', 'ahogo', 'atragantamiento', 'asfixia', 'tos', 'pecho'],
    cardiovascular: ['corazón', 'pecho', 'dolor pecho', 'paro', 'infarto'],
    quemadura: ['quemadura', 'quemado', 'fuego', 'calor', 'ampolla'],
    envenenamiento: ['intoxicación', 'veneno', 'comió', 'tóxico', 'medicamento'],
    neurologico: ['inconsciente', 'desmayo', 'convulsión', 'ataque', 'cabeza']
  };
  
  let bestCategory = 'otro';
  let bestScore = 0;
  let foundKeywords: string[] = [];
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => messageLower.includes(keyword));
    
    // Si hay una palabra clave muy fuerte, aumentamos el score
    let score = matches.length;
    const strongKeywords = ['inconsciente', 'paro', 'infarto', 'no respira', 'muerto', 'sangrado'];
    if (strongKeywords.some(sw => messageLower.includes(sw))) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
      foundKeywords = matches;
    }
  }
  
  const confidence = Math.min(bestScore / 2, 1); // Ahora con 2 puntos llegamos a 100% o nivel alto
  
  return {
    category: bestCategory,
    confidence,
    suggestedKeywords: foundKeywords
  };
}
