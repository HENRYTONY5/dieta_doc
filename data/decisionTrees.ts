// Árboles de decisión para primeros auxilios
// Sistema de preguntas estructuradas que guía al usuario al protocolo correcto

export interface DecisionNode {
  id: string;
  question: string;
  type: 'question' | 'protocol' | 'emergency';
  
  // Para nodos de pregunta
  options?: DecisionOption[];
  
  // Para nodos terminales (protocolos)
  protocolId?: string;
  level?: 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE';
  immediateAction?: string; // Acción urgente antes de continuar
  
  // Contexto adicional
  context?: string;
  image?: string; // URL de imagen ilustrativa (futuro)
}

export interface DecisionOption {
  id: string;
  label: string;
  nextNodeId: string;
  keywords?: string[]; // Para detección automática en texto libre
}

export interface DecisionTree {
  id: string;
  name: string;
  description: string;
  category: string;
  startNodeId: string;
  nodes: { [key: string]: DecisionNode };
}

// ========================================
// ÁRBOL 1: PERSONA NO RESPONDE
// ========================================
export const unconsciousTree: DecisionTree = {
  id: 'unconscious-tree',
  name: 'Persona No Responde',
  description: 'Evaluación de persona inconsciente o que no responde',
  category: 'neurologico',
  startNodeId: 'check-breathing',
  nodes: {
    'check-breathing': {
      id: 'check-breathing',
      type: 'question',
      question: '¿La persona está respirando? (Ver el pecho subir/bajar, oír respiración, sentir aire)',
      options: [
        {
          id: 'breathing-yes',
          label: 'SÍ, está respirando',
          nextNodeId: 'check-consciousness',
          keywords: ['si', 'sí', 'respira', 'respirando']
        },
        {
          id: 'breathing-no',
          label: 'NO respira o no estoy seguro',
          nextNodeId: 'no-breathing-critical',
          keywords: ['no', 'no respira', 'no veo']
        }
      ]
    },
    'no-breathing-critical': {
      id: 'no-breathing-critical',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 EMERGENCIA CRÍTICA - ACTUAR INMEDIATAMENTE',
      immediateAction: '1. ¡LLAMAR 911 AHORA! 2. Iniciar RCP inmediatamente',
      protocolId: 'persona-inconsciente',
      context: 'Paro respiratorio - cada segundo cuenta. Si hay alguien más, que llame al 911 mientras inicias RCP.'
    },
    'check-consciousness': {
      id: 'check-consciousness',
      type: 'question',
      question: 'La persona respira pero ¿responde cuando le hablas o la tocas?',
      options: [
        {
          id: 'conscious-yes',
          label: 'SÍ, responde (habla, mueve ojos, reacciona)',
          nextNodeId: 'check-symptoms',
          keywords: ['si', 'sí', 'responde', 'habla']
        },
        {
          id: 'conscious-no',
          label: 'NO responde pero respira',
          nextNodeId: 'unconscious-breathing',
          keywords: ['no', 'no responde', 'dormido']
        }
      ]
    },
    'unconscious-breathing': {
      id: 'unconscious-breathing',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 PERSONA INCONSCIENTE QUE RESPIRA',
      immediateAction: '1. LLAMAR 911 2. Posición lateral de seguridad',
      protocolId: 'persona-inconsciente',
      context: 'Mantener vías respiratorias despejadas. No dar nada de beber.'
    },
    'check-symptoms': {
      id: 'check-symptoms',
      type: 'question',
      question: '¿Qué le pasó a la persona? (Selecciona lo más cercano)',
      options: [
        {
          id: 'fell-hit',
          label: 'Se cayó o recibió un golpe',
          nextNodeId: 'trauma-assessment',
          keywords: ['cayó', 'golpe', 'caída', 'accidente']
        },
        {
          id: 'chest-pain',
          label: 'Tiene dolor en el pecho',
          nextNodeId: 'chest-pain-protocol',
          keywords: ['pecho', 'corazón', 'dolor pecho']
        },
        {
          id: 'seizure',
          label: 'Tuvo convulsiones o temblores',
          nextNodeId: 'seizure-protocol',
          keywords: ['convulsión', 'ataque', 'temblor']
        },
        {
          id: 'other',
          label: 'Otro / No sé',
          nextNodeId: 'general-assessment',
          keywords: ['otro', 'no sé']
        }
      ]
    },
    'trauma-assessment': {
      id: 'trauma-assessment',
      type: 'protocol',
      level: 'URGENTE',
      question: 'Evaluación de trauma - sigue estos pasos',
      protocolId: 'persona-inconsciente',
      context: 'Posible traumatismo craneal. No mover el cuello.'
    },
    'chest-pain-protocol': {
      id: 'chest-pain-protocol',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 POSIBLE ATAQUE CARDÍACO',
      immediateAction: 'LLAMAR 911 - Sentar a la persona, aflojar ropa',
      context: 'No dar comida ni bebida. Mantener calmado.'
    },
    'seizure-protocol': {
      id: 'seizure-protocol',
      type: 'protocol',
      level: 'URGENTE',
      question: 'Protocolo de convulsiones',
      protocolId: 'convulsion'
    },
    'general-assessment': {
      id: 'general-assessment',
      type: 'protocol',
      level: 'URGENTE',
      question: 'Evaluación general - llamar 911 por persona inconsciente',
      protocolId: 'persona-inconsciente'
    }
  }
};

// ========================================
// ÁRBOL 2: SANGRADO/HERIDAS
// ========================================
export const bleedingTree: DecisionTree = {
  id: 'bleeding-tree',
  name: 'Sangrado o Herida',
  description: 'Evaluación y tratamiento de heridas con sangrado',
  category: 'trauma',
  startNodeId: 'bleeding-severity',
  nodes: {
    'bleeding-severity': {
      id: 'bleeding-severity',
      type: 'question',
      question: '¿Cómo está sangrando? (Describe la situación)',
      options: [
        {
          id: 'bleeding-spurting',
          label: 'Sale a chorros o muy abundante',
          nextNodeId: 'severe-bleeding',
          keywords: ['chorros', 'mucha sangre', 'abundante', 'pulsátil']
        },
        {
          id: 'bleeding-moderate',
          label: 'Sangra pero no a chorros',
          nextNodeId: 'moderate-bleeding',
          keywords: ['normal', 'constante', 'moderado']
        },
        {
          id: 'bleeding-minor',
          label: 'Sangrado leve (gotas o poco)',
          nextNodeId: 'minor-bleeding',
          keywords: ['poco', 'leve', 'gotas', 'rasguño']
        }
      ]
    },
    'severe-bleeding': {
      id: 'severe-bleeding',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 HEMORRAGIA SEVERA',
      immediateAction: '1. LLAMAR 911 2. Presión DIRECTA y FUERTE en la herida 3. NO soltar',
      protocolId: 'cortada-herida',
      context: 'Hemorragia severa - riesgo de shock. Mantener presión hasta que llegue ayuda.'
    },
    'moderate-bleeding': {
      id: 'moderate-bleeding',
      type: 'question',
      question: '¿Dónde está la herida?',
      options: [
        {
          id: 'location-limb',
          label: 'Brazo, mano, pierna o pie',
          nextNodeId: 'limb-bleeding',
          keywords: ['brazo', 'mano', 'pierna', 'pie', 'dedo']
        },
        {
          id: 'location-head',
          label: 'Cabeza o cara',
          nextNodeId: 'head-bleeding',
          keywords: ['cabeza', 'cara', 'frente', 'nariz']
        },
        {
          id: 'location-torso',
          label: 'Pecho, abdomen o espalda',
          nextNodeId: 'torso-bleeding',
          keywords: ['pecho', 'abdomen', 'estómago', 'espalda']
        }
      ]
    },
    'limb-bleeding': {
      id: 'limb-bleeding',
      type: 'protocol',
      level: 'MODERADA',
      question: 'Tratamiento de herida en extremidades',
      protocolId: 'cortada-herida',
      immediateAction: 'Presión directa + elevar extremidad',
      context: 'Presionar durante 10 minutos sin levantar.'
    },
    'head-bleeding': {
      id: 'head-bleeding',
      type: 'emergency',
      level: 'URGENTE',
      question: '⚠️ HERIDA EN CABEZA',
      immediateAction: 'Presión suave + llamar 911 si fue por golpe fuerte',
      protocolId: 'cortada-herida',
      context: 'Las heridas en cabeza sangran mucho. Evaluar si hay signos de conmoción.'
    },
    'torso-bleeding': {
      id: 'torso-bleeding',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 HERIDA EN TORSO',
      immediateAction: 'LLAMAR 911 + Presión con tela limpia + NO quitar objetos incrustados',
      context: 'Posible lesión interna. No dar comida ni bebida.'
    },
    'minor-bleeding': {
      id: 'minor-bleeding',
      type: 'protocol',
      level: 'LEVE',
      question: 'Tratamiento de herida leve',
      protocolId: 'cortada-herida',
      context: 'Limpiar con agua y jabón, aplicar presión suave, cubrir.'
    }
  }
};

// ========================================
// ÁRBOL 3: DIFICULTAD PARA RESPIRAR
// ========================================
export const breathingTree: DecisionTree = {
  id: 'breathing-tree',
  name: 'Dificultad para Respirar',
  description: 'Evaluación de problemas respiratorios',
  category: 'respiratorio',
  startNodeId: 'breathing-check',
  nodes: {
    'breathing-check': {
      id: 'breathing-check',
      type: 'question',
      question: '¿La persona puede hablar?',
      options: [
        {
          id: 'can-speak',
          label: 'SÍ puede hablar (aunque con dificultad)',
          nextNodeId: 'breathing-partial',
          keywords: ['si', 'sí', 'habla', 'puede hablar']
        },
        {
          id: 'cannot-speak',
          label: 'NO puede hablar ni emitir sonidos',
          nextNodeId: 'choking-critical',
          keywords: ['no', 'no habla', 'silencio', 'mudo']
        }
      ]
    },
    'choking-critical': {
      id: 'choking-critical',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 ATRAGANTAMIENTO TOTAL',
      immediateAction: 'Maniobra de Heimlich AHORA - 5 golpes espalda + 5 compresiones abdomen',
      protocolId: 'atragantamiento',
      context: 'Obstrucción completa - actuar inmediatamente. La persona puede llevarse las manos al cuello.'
    },
    'breathing-partial': {
      id: 'breathing-partial',
      type: 'question',
      question: '¿Qué pasó antes de tener dificultad para respirar?',
      options: [
        {
          id: 'eating',
          label: 'Estaba comiendo',
          nextNodeId: 'partial-choking',
          keywords: ['comiendo', 'comida', 'tragando']
        },
        {
          id: 'allergy',
          label: 'Posible reacción alérgica (hinchazón, urticaria)',
          nextNodeId: 'allergic-reaction',
          keywords: ['alergia', 'hinchazón', 'ronchas', 'picadura']
        },
        {
          id: 'asthma',
          label: 'Tiene asma o problema respiratorio conocido',
          nextNodeId: 'asthma-attack',
          keywords: ['asma', 'inhalador']
        },
        {
          id: 'sudden',
          label: 'Empezó de repente sin razón clara',
          nextNodeId: 'sudden-breathing',
          keywords: ['repente', 'súbito', 'no sé']
        }
      ]
    },
    'partial-choking': {
      id: 'partial-choking',
      type: 'protocol',
      level: 'URGENTE',
      question: 'Atragantamiento parcial',
      immediateAction: 'Animar a toser fuerte - NO golpear si puede toser',
      protocolId: 'atragantamiento',
      context: 'Si puede toser, es buena señal. Vigilar por si empeora.'
    },
    'allergic-reaction': {
      id: 'allergic-reaction',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 POSIBLE ANAFILAXIA',
      immediateAction: '1. LLAMAR 911 2. Usar EpiPen si tiene 3. Acostar con piernas elevadas',
      protocolId: 'shock-alergico',
      context: 'La anafilaxia puede ser mortal en minutos. Actuar rápido.'
    },
    'asthma-attack': {
      id: 'asthma-attack',
      type: 'protocol',
      level: 'URGENTE',
      question: 'Crisis asmática',
      immediateAction: 'Usar inhalador de rescate + sentar erguido + calmar',
      context: 'Si no mejora en 10 minutos con inhalador, llamar 911.'
    },
    'sudden-breathing': {
      id: 'sudden-breathing',
      type: 'emergency',
      level: 'URGENTE',
      question: '⚠️ DIFICULTAD RESPIRATORIA SÚBITA',
      immediateAction: 'Sentar erguido + aflojar ropa + llamar 911 si empeora',
      context: 'Posibles causas: ataque cardíaco, coágulo pulmonar, pánico.'
    }
  }
};

// ========================================
// ÁRBOL 4: QUEMADURAS
// ========================================
export const burnTree: DecisionTree = {
  id: 'burn-tree',
  name: 'Quemadura',
  description: 'Evaluación de quemaduras por calor, fuego o químicos',
  category: 'quemadura',
  startNodeId: 'burn-type',
  nodes: {
    'burn-type': {
      id: 'burn-type',
      type: 'question',
      question: '¿Qué causó la quemadura?',
      options: [
        {
          id: 'heat',
          label: 'Fuego, agua caliente, aceite, estufa (calor)',
          nextNodeId: 'burn-severity',
          keywords: ['fuego', 'calor', 'agua caliente', 'aceite', 'estufa']
        },
        {
          id: 'chemical',
          label: 'Químico (ácido, lejía, limpiador)',
          nextNodeId: 'chemical-burn',
          keywords: ['químico', 'ácido', 'lejía', 'limpiador', 'soda']
        },
        {
          id: 'electrical',
          label: 'Electricidad o corriente',
          nextNodeId: 'electrical-burn',
          keywords: ['electricidad', 'corriente', 'luz', 'cable']
        }
      ]
    },
    'burn-severity': {
      id: 'burn-severity',
      type: 'question',
      question: '¿Cómo se ve la quemadura?',
      options: [
        {
          id: 'red-painful',
          label: 'Roja y duele mucho (sin ampollas)',
          nextNodeId: 'first-degree',
          keywords: ['roja', 'duele', 'sin ampollas']
        },
        {
          id: 'blisters',
          label: 'Tiene ampollas (bolsas de líquido)',
          nextNodeId: 'second-degree',
          keywords: ['ampollas', 'bolsas', 'líquido']
        },
        {
          id: 'white-charred',
          label: 'Blanca, negra o no duele',
          nextNodeId: 'third-degree',
          keywords: ['blanca', 'negra', 'carbonizada', 'no duele']
        }
      ]
    },
    'first-degree': {
      id: 'first-degree',
      type: 'protocol',
      level: 'LEVE',
      question: 'Quemadura de primer grado',
      immediateAction: 'Enfriar con agua fría 10-20 minutos',
      protocolId: 'quemadura',
      context: 'Quemadura superficial. Similar a quemadura solar.'
    },
    'second-degree': {
      id: 'second-degree',
      type: 'question',
      question: '¿Qué tan grande es la quemadura?',
      options: [
        {
          id: 'small',
          label: 'Más pequeña que la palma de la mano',
          nextNodeId: 'minor-second-degree',
          keywords: ['pequeña', 'chica']
        },
        {
          id: 'large',
          label: 'Más grande que la palma de la mano',
          nextNodeId: 'major-second-degree',
          keywords: ['grande', 'extensa']
        }
      ]
    },
    'minor-second-degree': {
      id: 'minor-second-degree',
      type: 'protocol',
      level: 'MODERADA',
      question: 'Quemadura de segundo grado menor',
      immediateAction: 'Enfriar con agua + NO reventar ampollas + cubrir',
      protocolId: 'quemadura',
      context: 'Puede sanar en casa pero vigilar infección.'
    },
    'major-second-degree': {
      id: 'major-second-degree',
      type: 'emergency',
      level: 'URGENTE',
      question: '⚠️ QUEMADURA EXTENSA',
      immediateAction: 'Enfriar + cubrir con sábana limpia + LLAMAR 911',
      protocolId: 'quemadura',
      context: 'Quemaduras grandes necesitan atención médica urgente.'
    },
    'third-degree': {
      id: 'third-degree',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 QUEMADURA DE TERCER GRADO',
      immediateAction: '1. LLAMAR 911 2. Cubrir con sábana limpia 3. NO enfriar con agua',
      protocolId: 'quemadura',
      context: 'Quemadura profunda. NO retirar ropa pegada. Posible shock.'
    },
    'chemical-burn': {
      id: 'chemical-burn',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 QUEMADURA QUÍMICA',
      immediateAction: '1. LLAMAR 911 2. Enjuagar con agua 15-20 minutos 3. Quitar ropa contaminada',
      context: 'Identificar el químico si es posible. NO neutralizar con otro químico.'
    },
    'electrical-burn': {
      id: 'electrical-burn',
      type: 'emergency',
      level: 'CRÍTICA',
      question: '🚨 QUEMADURA ELÉCTRICA',
      immediateAction: 'LLAMAR 911 - Puede haber lesión interna aunque se vea pequeña',
      context: 'La electricidad daña tejidos profundos. SIEMPRE necesita evaluación médica.'
    }
  }
};

// Colección de todos los árboles
export const decisionTrees: { [key: string]: DecisionTree } = {
  'unconscious': unconsciousTree,
  'bleeding': bleedingTree,
  'breathing': breathingTree,
  'burn': burnTree
};

// Función para detectar qué árbol usar según el mensaje del usuario
export function detectRelevantTree(message: string): DecisionTree | null {
  const messageLower = message.toLowerCase();
  
  // Palabras clave para cada árbol
  const treeKeywords = {
    unconscious: ['inconsciente', 'no responde', 'desmayo', 'no despierta', 'dormido'],
    bleeding: ['sangrado', 'sangre', 'cortada', 'herida', 'corte'],
    breathing: ['respirar', 'ahogo', 'atragantamiento', 'asfixia', 'no respira'],
    burn: ['quemadura', 'quemado', 'fuego', 'calor', 'ampolla']
  };
  
  for (const [treeId, keywords] of Object.entries(treeKeywords)) {
    if (keywords.some(keyword => messageLower.includes(keyword))) {
      return decisionTrees[treeId];
    }
  }
  
  return null;
}
