// Servicio para comunicarse con Google Gemini (API gratuita con internet)

import { FirstAidProtocol, getProtocolMatches, searchProtocols } from '@/data/firstAidProtocols';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function buildLocalFallbackResponse(message: string): string {
  const protocolMatches = getProtocolMatches(message);
  const protocol = protocolMatches.length > 0 ? protocolMatches[0].protocol : null;
  
  // Detectar nivel de emergencia mucho más robusto para el fallback
  let detectedLevel: 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE' = 'MODERADA';
  const msg = message.toLowerCase();

  // Prioridad 1: Si hay un protocolo, usar su nivel
  if (protocol) {
    detectedLevel = protocol.level;
  } else {
    // Prioridad 2: Keywords críticas
    const criticalWords = ['no respira', 'inconsciente', 'paro', 'muerto', 'asfixia', 'ahoga', 'convulsion', 'convulsión'];
    const urgentWords = ['sangre', 'sangrado', 'quemadura', 'fractura', 'roto', 'hueso', 'dolor fuerte', 'pecho'];

    if (criticalWords.some(w => msg.includes(w))) {
      detectedLevel = 'CRÍTICA';
    } else if (urgentWords.some(w => msg.includes(w))) {
      detectedLevel = 'URGENTE';
    }
  }

  const stabilizationTime = protocol ? protocol.stabilizationTime : (detectedLevel === 'CRÍTICA' ? 0 : 10);

  if (!protocol) {
    return `[NIVEL: ${detectedLevel}]\n[TIEMPO DE ESTABILIZACIÓN: ${stabilizationTime} minutos]\n\n**⚠️ ATENCIÓN: Modo sin conexión (Gemini no configurado).**\n\n**ORIENTACIÓN INMEDIATA:**\n1. **Mantén la calma** y asegura el área.\n2. Verifica si la persona responde y respira.\n3. Si hay peligro inmediato o inconsciencia, llama al 911.\n\n**Por favor, describe con más detalle:**\n- ¿Qué sucedió exactamente?\n- ¿Hay sangrado o dificultad para respirar?\n\n**SIGUIENTE PASO:**\nDame más datos para intentar localizar un protocolo local de ayuda.`;
  }

  const steps = protocol.steps.slice(0, 5).map((step, index) => `${index + 1}. ${step}`).join('\n');
  const call911 = protocol.whenToCall911.slice(0, 4).map(item => `- ${item}`).join('\n');

  return `[NIVEL: ${protocol.level}]\n[TIEMPO DE ESTABILIZACIÓN: ${protocol.stabilizationTime} minutos]\n\n**⚠️ ATENCIÓN: Modo sin conexión.**\n\nHe localizado el protocolo local de **${protocol.title}** para ayudarte:\n\n**ORIENTACIÓN INMEDIATA:**\n${steps}\n\n**⚠️ CUÁNDO LLAMAR AL 911:**\n${call911}\n\n**SIGUIENTE PASO:**\nConfirma si ya aplicaste la presión/hielo o si la situación empeora.`;
}

/**
 * Usa Gemini para mapear una respuesta de lenguaje natural a una de las opciones del árbol
 */
export async function mapResponseToOption(
  question: string,
  userResponse: string,
  options: { id: string, label: string }[]
): Promise<string | null> {
  try {
    if (!GEMINI_API_KEY) return null;

    const optionsText = options.map(o => `- ID: ${o.id}, Etiqueta: ${o.label}`).join('\n');
    
    const prompt = `Analiza la respuesta del usuario a una pregunta médica y determina cuál de las opciones disponibles es la que mejor coincide.
    
PREGUNTA MÉDICA: "${question}"
RESPUESTA DEL USUARIO: "${userResponse}"

OPCIONES DISPONIBLES:
${optionsText}

REGLAS:
1. Responde ÚNICAMENTE con el ID de la opción que mejor coincida.
2. Si ninguna coincide razonablemente, responde "NONE".
3. Ignora errores de ortografía o gramática.
4. Ten en cuenta sinónimos y contexto médico.

ID DE LA OPCIÓN ELEGIDA:`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 10 }
      })
    });

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'NONE';
    
    return result === 'NONE' ? null : result;
  } catch (error) {
    console.error('Error en mapResponseToOption:', error);
    return null;
  }
}

/**
 * Usa Gemini para humanizar y dar más detalle a un paso del árbol de decisión
 */
export async function enrichNodeResponse(
  nodeQuestion: string,
  context: string,
  history: string[] = []
): Promise<string | null> {
  try {
    if (!GEMINI_API_KEY) return null;

    const prompt = `Como asistente de primeros auxilios, humaniza y mejora este paso de un árbol de decisión.
    
PASO ACTUAL: "${nodeQuestion}"
CONTEXTO MÉDICO: "${context}"
HISTORIAL RECIENTE: ${history.join(' -> ')}

Instrucciones:
1. Sé empático y calmado.
2. Da un pequeño detalle adicional o "pro-tip" de por qué esta pregunta es importante.
3. El resultado debe ser corto (máximo 3 frases).
4. No cambies el sentido de la pregunta original.
5. Responde en ESPAÑOL.

RESPUESTA HUMANIZADA:`;

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (error) {
    console.error('Error en enrichNodeResponse:', error);
    return null;
  }
}

/**
 * Formatea un protocolo para incluirlo en el prompt
 */
function formatProtocolForPrompt(protocol: FirstAidProtocol): string {
  let formatted = `\n**${protocol.title.toUpperCase()}** [${protocol.level}]\n`;
  formatted += `Tiempo de estabilización: ${protocol.stabilizationTime} minutos\n`;
  formatted += `Descripción: ${protocol.description}\n\n`;
  
  formatted += `Síntomas a observar:\n`;
  protocol.symptoms.forEach(symptom => {
    formatted += `  • ${symptom}\n`;
  });
  formatted += `\n`;
  
  formatted += `Pasos a seguir:\n`;
  protocol.steps.forEach((step, i) => {
    formatted += `  ${i + 1}. ${step}\n`;
  });
  formatted += `\n`;
  
  formatted += `⚠️ Advertencias:\n`;
  protocol.warnings.forEach(warning => {
    formatted += `  • ${warning}\n`;
  });
  formatted += `\n`;
  
  formatted += `🚨 Llamar a 911 si:\n`;
  protocol.whenToCall911.forEach(condition => {
    formatted += `  • ${condition}\n`;
  });
  
  return formatted;
}

/**
 * Envía un mensaje a Gemini y obtiene una respuesta
 */
export async function sendMessageToGemini(
  message: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Falta EXPO_PUBLIC_GEMINI_API_KEY');
    }

    // Buscar protocolos relevantes basados en el mensaje del usuario
    const relevantProtocols = searchProtocols(message).slice(0, 2); // Top 2 más relevantes
    
    // Construir protocolos en el prompt
    let protocolsContext = '';
    if (relevantProtocols.length > 0) {
      protocolsContext = '\n\n💉 PROTOCOLOS RELEVANTES PARA ESTA SITUACIÓN:\n';
      protocolsContext += relevantProtocols.map(p => formatProtocolForPrompt(p)).join('\n');
    }

    // Construir el contexto con system prompt y historial
    const systemPrompt = `Eres un ASISTENTE DE PRIMEROS AUXILIOS especializado. SIEMPRE respondes en ESPAÑOL.

⚕ REGLAS OBLIGATORIAS:
1. TODO tu texto debe estar en español (nada en inglés)
2. Usa formato Markdown: **negritas** para pasos importantes
3. SIEMPRE clasifica la emergencia al inicio
4. Da instrucciones NUMERADAS y MUY CLARAS
5. Mantén FLUJO DE CONVERSACIÓN por turnos (no monólogo)
6. Haz máximo 1 o 2 preguntas por turno para no saturar
7. ESCUCHA ACTIVAMENTE: Analiza cuidadosamente el mensaje del usuario. Si el usuario te dice que ya hizo algo o responde a tu pregunta, RECONOCE su respuesta antes de dar el siguiente paso (ej: "Entiendo que ya le pusiste hielo, muy bien. Ahora...").
8. SÉ EMPÁTICO: Usa un tono calmado y de apoyo (ej: "Tranquilo, estoy aquí para guiarte", "Entiendo que duela, vamos a manejarlo juntos").
9. ADAPTABILIDAD: Si el usuario describe una situación que no está en los protocolos cargados, usa tu conocimiento médico general para dar la mejor recomendación de primeros auxilios posible, manteniendo siempre el formato estricto.

🗣 ESTILO CONVERSACIONAL OBLIGATORIO:
- Inicia SIEMPRE validando lo que el usuario acaba de decir y mostrando empatía.
- Luego orienta con 2-3 pasos concretos y accionables, basados en lo que el usuario acaba de describir.
- Después haz una pregunta suave para saber cómo sigue o para obtener información vital que falte.
- Cierra con "SIGUIENTE PASO" para guiar el siguiente turno.
- NUNCA repitas preguntas que el usuario ya respondió.

🚨 CLASIFICACIÓN DE EMERGENCIAS:
- **CRÍTICA**: No respira, inconsciente, sangrado abundante, paro cardíaco
- **URGENTE**: Fractura expuesta, quemadura grave, asfixia parcial, dolor intenso
- **MODERADA**: Esguince, cortada profunda, quemadura leve, golpe fuerte
- **LEVE**: Rasguño, golpe menor, dolor leve, mareo

💉 BASE DE CONOCIMIENTO DINÁMICAMENTE CARGADA:${protocolsContext}

📝 FORMATO DE RESPUESTA OBLIGATORIO:

[NIVEL: CRÍTICA/URGENTE/MODERADA/LEVE]
[TIEMPO DE ESTABILIZACIÓN: X minutos]

**Te escucho:**
(Inicia con una frase empática y tranquilizadora, reconociendo lo que el usuario acaba de decir o sentir. Ej: "Entiendo que te duela mucho, vamos a tratar de calmarlo juntos.")

**ORIENTACIÓN INMEDIATA:**
1. [Paso claro con **negritas** en lo importante]
2. [Siguiente paso]

**¿Cómo te sientes ahora?**
(Haz 1 pregunta suave y específica sobre la evolución o para obtener el dato que falta)

**SIGUIENTE PASO:**
[Indica exactamente qué debe responder o hacer ahora el usuario]

**⚠️ CUÁNDO LLAMAR A EMERGENCIAS:**
- [Condiciones específicas para esta emergencia]

✅ SIEMPRE:
- Responde en español puro
- Usa markdown para formato (**negritas**, listas)
- Sé MUY EMPÁTICO, TRANQUILIZADOR y ESCUCHA ACTIVAMENTE
- Mantén conversación guiada en varios turnos
- Basa tus respuestas en los protocolos proporcionados, pero si no hay uno exacto, usa tu conocimiento médico general para dar la mejor recomendación.
- Recomienda 911 SOLO si hay señales de alarma claras o empeoramiento clínico evidente`;

    // Construir el prompt completo con historial
    let fullPrompt = systemPrompt + '\n\n';
    
    // Agregar últimos 3 mensajes de historial
    const recentHistory = conversationHistory.slice(-3);
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        fullPrompt += `Usuario: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        fullPrompt += `Asistente: ${msg.content}\n\n`;
      }
    }

    fullPrompt += `Usuario: ${message}\n\nAsistente:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    console.log('🔍 Enviando solicitud a Gemini con protocolos relevantes...');
    console.log('📋 Protocolos cargados:', relevantProtocols.map(p => p.title));
    
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de Gemini API:', errorData);
      
      // Mensajes de error más específicos
      if (response.status === 400) {
        if (errorData.error?.message?.includes('API_KEY')) {
          throw new Error('API Key inválida. Verifica que la hayas copiado correctamente en geminiService.ts');
        }
        throw new Error(`Error en la solicitud: ${errorData.error?.message || 'Formato incorrecto'}`);
      } else if (response.status === 429) {
        throw new Error('Has excedido el límite de solicitudes (60/min). Espera un minuto e intenta de nuevo.');
      }
      
      throw new Error(`Error de Gemini API: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta recibida de Gemini');
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.candidates && data.candidates[0]?.finishReason === 'SAFETY') {
      throw new Error('Gemini bloqueó la respuesta por seguridad. Intenta reformular tu pregunta.');
    } else {
      console.error('Respuesta inesperada:', data);
      throw new Error('Respuesta inválida de Gemini');
    }
  } catch (error) {
    console.error('❌ Error al comunicarse con Gemini:', error);
    return buildLocalFallbackResponse(message);
  }
}

/**
 * Verifica si la API de Gemini está disponible
 */
export async function checkGeminiStatus(): Promise<boolean> {
  try {
    if (!GEMINI_API_KEY) {
      return false;
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'test' }] }]
      }),
    });
    return response.ok || response.status === 400; // 400 es válido, significa que la API responde
  } catch (error) {
    return false;
  }
}
