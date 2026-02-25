// Motor de navegación para árboles de decisión
// Maneja el flujo conversacional guiado por el árbol

import { DecisionNode, DecisionOption, DecisionTree, decisionTrees, detectRelevantTree } from '@/data/decisionTrees';
import { enrichNodeResponse, mapResponseToOption } from './geminiService';
import { getProtocolById } from './knowledgeBase';

export interface ConversationState {
  treeId: string | null;
  currentNodeId: string | null;
  history: string[]; // IDs de nodos visitados
  answers: { [nodeId: string]: string }; // Respuestas del usuario
}

export interface NavigationResult {
  currentNode: DecisionNode;
  tree: DecisionTree;
  isComplete: boolean; // true si llegamos a un protocolo final
  protocolId?: string;
  formattedResponse: string; // Respuesta para mostrar al usuario
}

/**
 * Iniciar un árbol de decisión basado en el mensaje del usuario
 */
export async function startDecisionTree(userMessage: string): Promise<NavigationResult | null> {
  const tree = detectRelevantTree(userMessage);
  
  if (!tree) {
    return null; // No se detectó un árbol relevante
  }
  
  const startNode = tree.nodes[tree.startNodeId];
  
  // Intentar enriquecer la respuesta inicial con Gemini
  let baseResponse = formatNodeAsResponse(startNode, tree);
  try {
    const enriched = await enrichNodeResponse(startNode.question, startNode.context || tree.description);
    if (enriched) {
      baseResponse = `✨ **Guía Inteligente:** ${enriched}\n\n---\n\n${baseResponse}`;
    }
  } catch (e) {
    console.log('Error enriqueciendo respuesta inicial:', e);
  }
  
  return {
    currentNode: startNode,
    tree: tree,
    isComplete: false,
    formattedResponse: baseResponse
  };
}

/**
 * Navegar al siguiente nodo según la respuesta del usuario
 */
export async function navigateTree(
  tree: DecisionTree,
  currentNodeId: string,
  userAnswer: string,
  history: string[] = []
): Promise<NavigationResult> {
  const currentNode = tree.nodes[currentNodeId];
  
  // Encontrar la opción que coincide con la respuesta
  let selectedOption: DecisionOption | null = null;
  
  if (currentNode.options) {
    // 1. INTENTAR MATCH LOCAL (Rápido)
    const answerLower = userAnswer.toLowerCase();
    
    // Buscar números primero
    const numIdx = parseNumericAnswer(userAnswer, currentNode.options.length);
    if (numIdx !== null) {
      selectedOption = currentNode.options[numIdx];
    } else {
      // Buscar por coincidencia exacta de ID o keywords locally
      for (const option of currentNode.options) {
        if (option.keywords && option.keywords.some(kw => answerLower.includes(kw))) {
          selectedOption = option;
          break;
        }
        if (answerLower.includes(option.label.toLowerCase())) {
          selectedOption = option;
          break;
        }
      }
    }

    // 2. SI NO HAY MATCH LOCAL, PEDIR AYUDA A GEMINI (Inteligente)
    if (!selectedOption && currentNode.options.length > 0) {
      console.log('🧠 IA: Mapeando respuesta natural a opción del árbol...');
      const geminiOptionId = await mapResponseToOption(
        currentNode.question,
        userAnswer,
        currentNode.options.map(o => ({ id: o.id, label: o.label }))
      );

      if (geminiOptionId) {
        selectedOption = currentNode.options.find(o => o.id === geminiOptionId) || null;
      }
    }
    
    // Si sigue sin haber coincidencia, pedir aclaración
    if (!selectedOption && currentNode.options.length > 0) {
      return {
        currentNode: currentNode,
        tree: tree,
        isComplete: false,
        formattedResponse: formatClarificationRequest(currentNode)
      };
    }
  }
  
  // Si no hay opción seleccionada y no hay opciones, es un nodo terminal
  if (!selectedOption) {
    return {
      currentNode: currentNode,
      tree: tree,
      isComplete: true,
      protocolId: currentNode.protocolId,
      formattedResponse: await formatTerminalNode(currentNode, tree)
    };
  }
  
  // Navegar al siguiente nodo
  const nextNode = tree.nodes[selectedOption.nextNodeId];
  const isTerminal = nextNode.type === 'protocol' || nextNode.type === 'emergency';
  
  let formattedResponse: string;
  if (isTerminal) {
    formattedResponse = await formatTerminalNode(nextNode, tree);
  } else {
    formattedResponse = formatNodeAsResponse(nextNode, tree);
    
    // Intentar enriquecer con Gemini solo para nodos no terminales (preguntas)
    try {
      const enriched = await enrichNodeResponse(nextNode.question, nextNode.context || tree.description, history);
      if (enriched) {
        formattedResponse = `✨ **Dato Vital:** ${enriched}\n\n---\n\n${formattedResponse}`;
      }
    } catch (e) {
      console.log('Error enriqueciendo respuesta:', e);
    }
  }
  
  return {
    currentNode: nextNode,
    tree: tree,
    isComplete: isTerminal,
    protocolId: nextNode.protocolId,
    formattedResponse: formattedResponse
  };
}

/**
 * Formatear un nodo como respuesta conversacional
 */
function formatNodeAsResponse(node: DecisionNode, tree: DecisionTree): string {
  let response = '';
  
  // Agregar contexto si existe
  if (node.context) {
    response += `ℹ️ ${node.context}\n\n`;
  }
  
  // Agregar acción inmediata si existe
  if (node.immediateAction) {
    response += `⚡ **ACCIÓN INMEDIATA:**\n${node.immediateAction}\n\n`;
  }
  
  // Agregar pregunta
  response += `**${node.question}**\n\n`;
  
  // Agregar opciones si existen
  if (node.options && node.options.length > 0) {
    response += '**Selecciona una opción:**\n\n';
    node.options.forEach((option, index) => {
      response += `${index + 1}. ${option.label}\n`;
    });
    response += '\n💬 *Responde con el número o describe la situación*';
  }
  
  return response;
}

/**
 * Formatear nodo terminal con información del protocolo
 */
async function formatTerminalNode(node: DecisionNode, tree: DecisionTree): Promise<string> {
  let response = '';
  
  // Nivel de emergencia
  if (node.level) {
    const emoji = node.level === 'CRÍTICA' ? '🚨' : 
                  node.level === 'URGENTE' ? '⚠️' : 
                  node.level === 'MODERADA' ? '⚡' : 'ℹ️';
    response += `${emoji} **NIVEL: ${node.level}**\n\n`;
  }
  
  // Pregunta/título
  response += `**${node.question}**\n\n`;
  
  // Acción inmediata
  if (node.immediateAction) {
    response += `⚡ **ACCIÓN INMEDIATA:**\n${node.immediateAction}\n\n`;
  }
  
  // Contexto
  if (node.context) {
    response += `📋 ${node.context}\n\n`;
  }
  
  // Obtener protocolo detallado si existe
  if (node.protocolId) {
    const protocol = await getProtocolById(node.protocolId);
    if (protocol) {
      response += `---\n\n`;
      response += `**📚 PROTOCOLO COMPLETO: ${protocol.title}**\n\n`;
      
      response += `**🔍 Síntomas:**\n`;
      protocol.symptoms.forEach(symptom => {
        response += `• ${symptom}\n`;
      });
      
      response += `\n**📝 PASOS A SEGUIR:**\n`;
      protocol.steps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      
      response += `\n**⚠️ ADVERTENCIAS:**\n`;
      protocol.warnings.forEach(warning => {
        response += `• ${warning}\n`;
      });
      
      response += `\n**🚨 CUÁNDO LLAMAR AL 911:**\n`;
      protocol.whenToCall911.forEach(condition => {
        response += `• ${condition}\n`;
      });
      
      response += `\n⏱️ *Tiempo de estabilización: ${protocol.stabilizationTime} minutos*`;
    }
  }
  
  response += `\n\n✅ **¿Te ayudó esta información?** Puedes preguntarme otra cosa o decir "nueva emergencia" para evaluar otro caso.`;
  
  return response;
}

/**
 * Solicitar aclaración cuando la respuesta es ambigua
 */
function formatClarificationRequest(node: DecisionNode): string {
  let response = '🤔 No estoy seguro de entender tu respuesta.\n\n';
  response += `**${node.question}**\n\n`;
  response += '**Por favor selecciona:**\n\n';
  
  if (node.options) {
    node.options.forEach((option, index) => {
      response += `${index + 1}. ${option.label}\n`;
    });
  }
  
  response += '\n💬 *Responde con el número (1, 2, 3...) o describe más claramente*';
  
  return response;
}

/**
 * Detectar si el usuario quiere comenzar un nuevo árbol
 */
export function shouldStartNewTree(message: string): boolean {
  const resetKeywords = [
    'nueva emergencia',
    'otro caso',
    'otra situación',
    'empezar de nuevo',
    'reiniciar',
    'nueva consulta'
  ];
  
  const messageLower = message.toLowerCase();
  return resetKeywords.some(kw => messageLower.includes(kw));
}

/**
 * Obtener lista de árboles disponibles
 */
export function getAvailableTrees(): string {
  let response = '🌳 **ÁRBOLES DE DECISIÓN DISPONIBLES:**\n\n';
  
  Object.values(decisionTrees).forEach((tree, index) => {
    response += `${index + 1}. **${tree.name}**\n`;
    response += `   ${tree.description}\n\n`;
  });
  
  response += '💬 *Describe tu emergencia y te guiaré con preguntas específicas*';
  
  return response;
}

/**
 * Parsear respuesta numérica del usuario
 */
export function parseNumericAnswer(answer: string, optionsCount: number): number | null {
  // Buscar números en el texto
  const match = answer.match(/\d+/);
  if (match) {
    const num = parseInt(match[0]);
    if (num >= 1 && num <= optionsCount) {
      return num - 1; // Índice basado en 0
    }
  }
  return null;
}
