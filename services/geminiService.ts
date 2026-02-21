// Servicio para comunicarse con Google Gemini (API gratuita con internet)

import { FirstAidProtocol, searchProtocols } from '@/data/firstAidProtocols';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() || '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function buildLocalFallbackResponse(message: string): string {
  const protocol = searchProtocols(message)[0];

  if (!protocol) {
    return `[NIVEL: MODERADA]\n[TIEMPO DE ESTABILIZACIÓN: 10 minutos]\n\n**Te acompaño paso a paso.**\nCon lo que me dices, haré una orientación inicial mientras confirmamos datos clave.\n\n**ORIENTACIÓN INMEDIATA:**\n1. **Mantén la calma** y verifica si la persona respira y responde.\n2. Colócala en un lugar seguro, lejos del riesgo.\n3. Si hay sangrado, presiona con tela limpia de forma continua.\n\n**Para orientarte mejor, respóndeme esto:**\n1. ¿Qué síntoma es el más grave ahora mismo?\n2. ¿Desde cuándo comenzó y si está empeorando?\n\n**⚠️ CUÁNDO LLAMAR A EMERGENCIAS:**\n- Pérdida de conciencia\n- Dificultad respiratoria\n- Sangrado abundante\n\n**SIGUIENTE PASO:**\nRespóndeme esas 2 preguntas y te doy la siguiente acción exacta.`;
  }

  const steps = protocol.steps.slice(0, 5).map((step, index) => `${index + 1}. ${step}`).join('\n');
  const call911 = protocol.whenToCall911.slice(0, 4).map(item => `- ${item}`).join('\n');

  return `[NIVEL: ${protocol.level}]\n[TIEMPO DE ESTABILIZACIÓN: ${protocol.stabilizationTime} minutos]\n\n**Te acompaño paso a paso.**\nSegún tu descripción, el protocolo más cercano es **${protocol.title}**.\n\n**ORIENTACIÓN INMEDIATA:**\n${steps}\n\n**Para orientarte mejor, respóndeme esto:**\n1. ¿La persona puede hablar y respirar sin dificultad?\n2. ¿El síntoma principal está mejorando o empeorando?\n\n**⚠️ CUÁNDO LLAMAR A EMERGENCIAS:**\n${call911}\n\n**SIGUIENTE PASO:**\nCuando me respondas esas 2 preguntas, te doy la siguiente acción específica.`;
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
  6. Haz máximo 2 preguntas por turno para no saturar
  7. En cada respuesta incluye una acción inmediata segura + una pregunta de seguimiento

  🗣 ESTILO CONVERSACIONAL OBLIGATORIO:
  - Inicia con una frase breve de acompañamiento (ej: "Te ayudo paso a paso")
  - Luego orienta con 3-5 pasos concretos y accionables
  - Después pregunta solo lo esencial (1-2 preguntas)
  - Cierra con "SIGUIENTE PASO" para guiar el siguiente turno
  - Si el usuario ya respondió algo, NO repitas preguntas previas innecesarias

🚨 CLASIFICACIÓN DE EMERGENCIAS:
- **CRÍTICA**: No respira, inconsciente, sangrado abundante, paro cardíaco
- **URGENTE**: Fractura expuesta, quemadura grave, asfixia parcial, dolor intenso
- **MODERADA**: Esguince, cortada profunda, quemadura leve, golpe fuerte
- **LEVE**: Rasguño, golpe menor, dolor leve, mareo

💉 BASE DE CONOCIMIENTO DINÁMICAMENTE CARGADA:${protocolsContext}

📝 FORMATO DE RESPUESTA OBLIGATORIO:

[NIVEL: CRÍTICA/URGENTE/MODERADA/LEVE]
[TIEMPO DE ESTABILIZACIÓN: X minutos]

**¿Qué pasó exactamente?**
(Haz 1-2 preguntas específicas sobre la situación)

**ORIENTACIÓN INMEDIATA:**
1. [Paso claro con **negritas** en lo importante]
2. [Siguiente paso]
3. [etc.]

**SIGUIENTE PASO:**
[Indica exactamente qué debe responder o hacer ahora el usuario]

**⚠️ CUÁNDO LLAMAR A EMERGENCIAS:**
- [Condiciones específicas para esta emergencia]

**📌 NOTA IMPORTANTE:**
[Consejo final de seguridad]

✅ SIEMPRE:
- Responde en español puro
- Usa markdown para formato (**negritas**, listas)
- Sé claro, directo y profesional
- Mantén conversación guiada en varios turnos
- Basa tus respuestas en los protocolos proporcionados
- Si hay CUALQUIER duda sobre gravedad: recomienda 911`;

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
