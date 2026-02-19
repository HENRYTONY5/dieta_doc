// Motor de navegación para árboles de decisión
// Maneja el flujo conversacional guiado por el árbol

import { DecisionTree, DecisionNode, DecisionOption, decisionTrees, detectRelevantTree } from '@/data/decisionTrees';
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
  
  return {
    currentNode: startNode,
    tree: tree,
    isComplete: false,
    formattedResponse: formatNodeAsResponse(startNode, tree)
  };
}

/**
 * Navegar al siguiente nodo según la respuesta del usuario
 */
export async function navigateTree(
  tree: DecisionTree,
  currentNodeId: string,
  userAnswer: string
): Promise<NavigationResult> {
  const currentNode = tree.nodes[currentNodeId];
  
  // Encontrar la opción que coincide con la respuesta
  let selectedOption: DecisionOption | null = null;
  
  if (currentNode.options) {
    // Buscar por coincidencia exacta de ID o keywords
    const answerLower = userAnswer.toLowerCase();
    
    for (const option of currentNode.options) {
      // Coincidencia por keywords
      if (option.keywords) {
        if (option.keywords.some(kw => answerLower.includes(kw))) {
          selectedOption = option;
          break;
        }
      }
      
      // Coincidencia por label
      if (answerLower.includes(option.label.toLowerCase())) {
        selectedOption = option;
        break;
      }
      
      // Coincidencia por ID
      if (answerLower.includes(option.id)) {
        selectedOption = option;
        break;
      }
    }
    
    // Si no se encontró coincidencia, usar la primera opción como fallback
    // o pedir aclaración
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
  
  return {
    currentNode: nextNode,
    tree: tree,
    isComplete: isTerminal,
    protocolId: nextNode.protocolId,
    formattedResponse: isTerminal 
      ? await formatTerminalNode(nextNode, tree)
      : formatNodeAsResponse(nextNode, tree)
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
