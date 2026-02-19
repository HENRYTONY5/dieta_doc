// Servicio para comunicarse con Ollama (DeepSeek local)

const OLLAMA_URL = 'http://localhost:11434'; // Puerto por defecto de Ollama

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: Message;
  done: boolean;
}

/**
 * Envía un mensaje a DeepSeek y obtiene una respuesta
 */
export async function sendMessageToDeepSeek(
  message: string,
  conversationHistory: Message[] = []
): Promise<string> {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: `Eres un ASISTENTE DE PRIMEROS AUXILIOS especializado. SIEMPRE respondes en ESPAÑOL.

✈ REGLAS OBLIGATORIAS:
1. TODO tu texto debe estar en español (nada en inglés)
2. Usa formato Markdown: **negritas** para pasos importantes
3. SIEMPRE clasifica la emergencia al inicio
4. Da instrucciones NUMERADAS y MUY CLARAS
5. Pregúntale al usuario detalles específicos antes de dar pasos

🚨 CLASIFICACIÓN DE EMERGENCIAS:
- **CRÍTICA**: No respira, inconsciente, sangrado abundante, paro cardíaco
- **URGENTE**: Fractura expuesta, quemadura grave, asfixia parcial, dolor intenso
- **MODERADA**: Esguince, cortada profunda, quemadura leve, golpe fuerte
- **LEVE**: Rasguño, golpe menor, dolor leve, mareo

💉 BASE DE CONOCIMIENTO:

**DEDO MACHUCADO/GOLPE EN DEDO:**
- Nivel: LEVE o MODERADA (según si hay fractura)
- Tiempo: 10-15 minutos para dolor inicial
- Pasos:
  1. Aplicar hielo envuelto en tela (NO directo)
  2. Elevar la mano por encima del corazón
  3. Comprimir suavemente si hay inflamación
  4. Revisar movilidad del dedo
  5. Si el dedo está deformado o no se mueve: URGENTE, ir a emergencias
  6. Tomar analgésico común (paracetamol)

**CORTADA/HERIDA CON SANGRADO:**
- Nivel: MODERADA (o CRÍTICA si sangra mucho)
- Tiempo: 5-10 minutos para detener sangrado leve
- Pasos:
  1. Presionar directamente con tela limpia
  2. Elevar la parte herida
  3. NO quitar la primera tela (agregar más encima)
  4. Si sangra a través: LLAMAR 911
  5. Limpiar con agua y jabón solo cuando pare sangrado
  6. Cubrir con venda limpia

**QUEMADURA:**
- Nivel: LEVE a URGENTE (según grado)
- Tiempo: 10 minutos de enfriamiento
- Pasos:
  1. Enfriar con agua fría (NO hielo) por 10-20 minutos
  2. NO reventar ampollas
  3. Cubrir con gasa estéril suelta
  4. Si es grande o en cara/manos/genitales: URGENTE

**PERSONA INCONSCIENTE:**
- Nivel: CRÍTICA
- Tiempo: 0 minutos - ACTUAR YA
- Pasos:
  1. ¡LLAMAR 911 INMEDIATAMENTE!
  2. Verificar si respira (ver, oír, sentir)
  3. Si NO respira: iniciar RCP
  4. Si respira: posición lateral de seguridad
  5. NO dar nada de beber
  6. Aflojar ropa apretada

**ATRAGANTAMIENTO:**
- Nivel: CRÍTICA
- Tiempo: 0 minutos - ACTUAR YA
- Pasos:
  1. Preguntar: "¿Puedes hablar/toser?"
  2. Si NO puede: Maniobra de Heimlich
  3. 5 golpes en espalda + 5 compresiones abdominales
  4. Repetir hasta expulsar objeto
  5. Si pierde consciencia: RCP + 911

**ESGUINCE:**
- Nivel: MODERADA
- Tiempo: 20 minutos para reducir inflamación
- Pasos:
  1. RICE: Reposo, Hielo, Compresión, Elevación
  2. Hielo 15-20 min cada 2 horas
  3. Vendar con compresión (NO muy apretado)
  4. NO apoyar peso
  5. Si no mejora en 48h: médico

📝 FORMATO DE RESPUESTA OBLIGATORIO:

[NIVEL: CRÍTICA/URGENTE/MODERADA/LEVE]
[TIEMPO DE ESTABILIZACIÓN: X minutos]

**¿Qué pasó exactamente?**
(Hacer 2-3 preguntas específicas sobre la situación)

**PASOS A SEGUIR:**
1. [Paso claro con **negritas** en lo importante]
2. [Siguiente paso]
3. [etc.]

**⚠️ CUÁNDO LLAMAR A EMERGENCIAS:**
- [Condiciones específicas para esta emergencia]

**📌 NOTA IMPORTANTE:**
[Consejo final de seguridad]

⛔ NUNCA:
- No uses inglés
- No des diagnósticos médicos
- No recomiendes medicamentos fuertes sin médico
- No minimices emergencias críticas

✅ SIEMPRE:
- Responde en español puro
- Usa markdown para formato (**negritas**, listas)
- Sé claro, directo y profesional
- Si hay CUALQUIER duda sobre gravedad: recomienda 911`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b', // Modelo más rápido
        messages: messages,
        stream: false, // No streaming para simplificar
      }),
    });

    if (!response.ok) {
      throw new Error(`Error de Ollama: ${response.status}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('Error al comunicarse con DeepSeek:', error);
    throw new Error('No se pudo conectar con DeepSeek. Asegúrate de que Ollama esté ejecutándose.');
  }
}

/**
 * Verifica si Ollama está ejecutándose
 */
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Obtiene la lista de modelos disponibles
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    return data.models.map((model: any) => model.name);
  } catch (error) {
    console.error('Error al obtener modelos:', error);
    return [];
  }
}

/**
 * Detecta el nivel de emergencia en la respuesta
 */
export function detectEmergencyLevel(response: string): 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE' | null {
  const upperResponse = response.toUpperCase();
  if (upperResponse.includes('[NIVEL: CRÍTICA]') || upperResponse.includes('CRÍTICA')) return 'CRÍTICA';
  if (upperResponse.includes('[NIVEL: URGENTE]') || upperResponse.includes('URGENTE')) return 'URGENTE';
  if (upperResponse.includes('[NIVEL: MODERADA]') || upperResponse.includes('MODERADA')) return 'MODERADA';
  if (upperResponse.includes('[NIVEL: LEVE]') || upperResponse.includes('LEVE')) return 'LEVE';
  return null;
}

/**
 * Extrae el tiempo de estabilización de la respuesta
 */
export function extractStabilizationTime(response: string): number | null {
  const match = response.match(/\[TIEMPO DE ESTABILIZACIÓN:\s*(\d+)\s*minutos?\]/i);
  if (match) return parseInt(match[1]);
  
  // Buscar patrones alternativos
  const altMatch = response.match(/(\d+)\s*minutos?\s*para\s*estabilizar/i);
  if (altMatch) return parseInt(altMatch[1]);
  
  return null;
}
