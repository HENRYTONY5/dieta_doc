# 🌳 Sistema de Árboles de Decisión para Primeros Auxilios

## ¿Qué es?

Un sistema de **preguntas guiadas** que llevan al usuario al protocolo correcto mediante un flujo estructurado de decisiones.

## 📋 Proceso General de Atención del Chatbot de Primeros Auxilios

El chatbot de primeros auxilios funciona como un asistente conversacional diseñado para orientar al usuario en situaciones de emergencia o urgencias leves, proporcionando instrucciones claras, seguras y estructuradas, basadas en protocolos básicos de primeros auxilios.

**El proceso inicia cuando el usuario describe un síntoma, accidente o situación.** A partir de esta información, el chatbot realiza una **clasificación inicial del riesgo** mediante preguntas cortas y directas:
- Nivel de conciencia
- Estado de la respiración
- Presencia de sangrado
- Intensidad del dolor
- Otros signos vitales

**Si detecta señales de emergencia**, el chatbot activa de inmediato un **protocolo de escalamiento**, indicando al usuario que debe:
1. ✅ Llamar a servicios de emergencia (911 o número local)
2. ✅ Seguir acciones inmediatas mientras llega ayuda
3. ✅ Proporcionar información clara a los operadores

**Si la situación no es crítica**, el chatbot guía paso a paso con:
- Evaluaciones específicas
- Instrucciones detalladas
- Orientación sobre cuándo buscar atención médica

**En casos no críticos**, el chatbot guía al usuario paso a paso en la aplicación de primeros auxilios, cuidando que las instrucciones sean:
- ✅ Simples y comprensibles
- ✅ Fáciles de seguir
- ✅ Basadas en protocolos seguros

Durante todo el proceso, el chatbot mantiene un enfoque preventivo:
- 🛡️ Evita recomendaciones médicas complejas
- 🛡️ No proporciona diagnósticos definitivos
- 🛡️ Promueve la búsqueda de atención profesional cuando sea necesario

**Al finalizar**, el chatbot:
1. 📋 Confirma que el usuario entendió las instrucciones
2. 📋 Ofrece recomendaciones de seguimiento (observar síntomas, cuándo buscar atención médica)
3. 📋 Registra el caso de forma anónima para fines estadísticos o de mejora del sistema

## 🎯 Ventajas vs RAG Simple

| Característica | RAG Simple | Árbol de Decisión + RAG |
|----------------|-----------|------------------------|
| Respuesta directa | ✅ | ✅ |
| Guía paso a paso | ❌ | ✅ |
| Preguntas específicas | ❌ | ✅ |
| Evita confusión | Parcial | ✅ |
| Detecta síntomas | ❌ | ✅ |
| Estructura clara | ❌ | ✅ |

## � 5 Casos de Uso del Chatbot de Primeros Auxilios

### Caso de Uso 1: Atención por Cortadura Leve (Herida Superficial)

**Descripción:** El usuario reporta que se cortó con un cuchillo o un objeto filoso, pero el sangrado es leve.

**Flujo:**
1. El usuario describe la herida
2. El chatbot pregunta si el sangrado es abundante o si no se detiene
3. Si es leve, guía al usuario a:
   - Lavarse las manos
   - Lavar la herida con agua
   - Presionar con gasa limpia
   - Aplicar antiséptico
   - Cubrir con venda o curita
4. Indica signos de alarma: enrojecimiento extremo, pus, fiebre, sangrado persistente
5. Recomienda acudir a atención médica si la herida es profunda o fue causada por objeto sucio

### Caso de Uso 2: Quemadura Doméstica (Primer Grado o Leve)

**Descripción:** El usuario se quemó con agua caliente, aceite, vapor o una superficie caliente.

**Flujo:**
1. El usuario reporta una quemadura
2. El chatbot pregunta:
   - ¿Qué área del cuerpo?
   - ¿Tamaño aproximado?
   - ¿Hay ampollas?
3. Si es leve, guía al usuario a:
   - Enfriar con agua corriente (10–20 minutos)
   - Retirar anillos o accesorios
   - **NO** aplicar pasta dental, mantequilla ni remedios caseros
   - Cubrir con gasa limpia
4. Si hay ampollas grandes, dolor intenso o área extensa → recomienda atención médica

### Caso de Uso 3: Atragantamiento (Obstrucción de Vía Aérea)

**Descripción:** El usuario indica que alguien está atragantado.

**Flujo:**
1. El usuario reporta atragantamiento
2. El chatbot pregunta si la persona:
   - ¿Puede hablar?
   - ¿Puede toser?
   - ¿Puede respirar?
3. Si puede toser:
   - Animar a toser fuerte
   - No dar golpes innecesarios
4. Si **NO** puede respirar o hablar:
   - **LLAMAR a emergencias inmediatamente**
   - Guía sobre Maniobra de Heimlich (adaptado para adulto/niño)
5. Si la persona pierde el conocimiento:
   - Indica iniciar RCP (solo pasos básicos y seguros)
   - Continuar hasta que llegue ayuda

**⚠️ Nota:** Este caso siempre debe incluir un mensaje de emergencia inmediato.

### Caso de Uso 4: Desmayo o Pérdida Breve de Conciencia

**Descripción:** El usuario reporta que alguien se desmayó o se siente a punto de desmayarse.

**Flujo:**
1. El usuario describe el evento
2. El chatbot pregunta:
   - ¿Está consciente?
   - ¿Respira?
   - ¿Tiene dolor en pecho o dificultad respiratoria?
3. Si está consciente:
   - Indicar recostarse
   - Elevar piernas
   - Aflojar ropa ajustada
   - Ventilar el lugar
4. Si **NO responde**:
   - **LLAMAR a emergencias**
   - Verificar respiración
   - Colocar en posición lateral de seguridad (si respira)
5. Da señales de alarma: convulsiones, golpe en la cabeza, desmayo prolongado, confusión

### Caso de Uso 5: Picadura o Mordedura (Insecto o Animal)

**Descripción:** El usuario reporta una picadura de abeja, avispa, araña o mordedura leve.

**Flujo:**
1. El usuario describe la picadura/mordedura
2. El chatbot pregunta:
   - ¿Hay hinchazón en cara o garganta?
   - ¿Hay dificultad para respirar?
   - ¿Hay mareo o vómito?
3. Si hay síntomas graves:
   - **LLAMAR a emergencias inmediatamente**
4. Si es leve:
   - Lavar con agua y jabón
   - Aplicar compresa fría
   - No rascar
   - Retirar aguijón (si aplica)
5. Señales de alarma: reacción alérgica, fiebre, dolor intenso, herida infectada

### 🎯 Cierre General (Para Todos los Casos)

En todos los casos, el chatbot debe finalizar con:

✅ **Confirmación de seguridad**
- "¿La persona respira normalmente?"
- "¿El sangrado se detuvo?"
- "¿Desapareció el síntoma?"

✅ **Recomendación de acudir a atención médica**
- Si los síntomas empeoran
- Si la situación no mejora en el tiempo esperado
- Si hay dudas sobre la gravedad

✅ **Recordatorio fundamental**
- 📌 "Este chatbot no sustituye atención médica profesional."

## �📊 Cómo Funciona

```
Usuario: "Una persona no responde"
  ↓
🌳 Se activa árbol "Persona No Responde"
  ↓
Pregunta 1: ¿Está respirando?
  └─ NO → 🚨 EMERGENCIA CRÍTICA → RCP + 911
  └─ SÍ → Pregunta 2: ¿Responde cuando le hablas?
      └─ NO → 🚨 Posición lateral + 911
      └─ SÍ → Pregunta 3: ¿Qué le pasó?
          └─ Se cayó → Protocolo de trauma
          └─ Dolor pecho → Protocolo cardíaco
```

## 🌲 Árboles Implementados

1. **Persona No Responde** - Inconsciente, desmayo
2. **Sangrado/Herida** - Evaluación de gravedad y ubicación
3. **Dificultad Respirar** - Atragantamiento, asfixia, alergias
4. **Quemaduras** - Por calor, químicos o electricidad

## ➕ Cómo Agregar un Nuevo Árbol

### Paso 1: Definir la estructura

```typescript
export const tuArbolTree: DecisionTree = {
  id: 'tu-arbol',
  name: 'Nombre del Árbol',
  description: 'Descripción breve',
  category: 'trauma', // o 'respiratorio', 'cardiovascular', etc.
  startNodeId: 'nodo-inicial',
  nodes: {
    'nodo-inicial': {
      id: 'nodo-inicial',
      type: 'question',
      question: '¿Pregunta inicial?',
      options: [
        {
          id: 'opcion1',
          label: 'Primera opción',
          nextNodeId: 'siguiente-nodo',
          keywords: ['palabras', 'clave']
        },
        {
          id: 'opcion2',
          label: 'Segunda opción',
          nextNodeId: 'otro-nodo',
          keywords: ['otras', 'palabras']
        }
      ]
    },
    'siguiente-nodo': {
      id: 'siguiente-nodo',
      type: 'protocol',
      level: 'CRÍTICA', // o 'URGENTE', 'MODERADA', 'LEVE'
      question: 'Título del protocolo',
      protocolId: 'id-del-protocolo',
      immediateAction: 'Acción urgente a tomar',
      context: 'Información adicional'
    }
  }
};
```

### Paso 2: Registrar en la colección

```typescript
// En data/decisionTrees.ts
export const decisionTrees: { [key: string]: DecisionTree } = {
  'unconscious': unconsciousTree,
  'bleeding': bleedingTree,
  'breathing': breathingTree,
  'burn': burnTree,
  'tu-arbol': tuArbolTree // ← Agregar aquí
};
```

### Paso 3: Agregar palabras clave de detección

```typescript
// En data/decisionTrees.ts, función detectRelevantTree
const treeKeywords = {
  unconscious: ['inconsciente', 'no responde', 'desmayo'],
  bleeding: ['sangrado', 'sangre', 'cortada'],
  breathing: ['respirar', 'ahogo', 'atragantamiento'],
  burn: ['quemadura', 'quemado', 'fuego'],
  'tu-arbol': ['palabras', 'clave', 'relevantes'] // ← Agregar aquí
};
```

## 📝 Tipos de Nodos

### 1. Question Node (Pregunta)
```typescript
{
  type: 'question',
  question: '¿Pregunta?',
  options: [...] // Opciones con siguiente nodo
}
```

### 2. Protocol Node (Protocolo final)
```typescript
{
  type: 'protocol',
  level: 'MODERADA',
  protocolId: 'id-protocolo',
  immediateAction: 'Qué hacer YA'
}
```

### 3. Emergency Node (Emergencia crítica)
```typescript
{
  type: 'emergency',
  level: 'CRÍTICA',
  immediateAction: '1. LLAMAR 911 2. RCP',
  context: 'Info importante'
}
```

## 🎨 Ejemplo Completo: Árbol de Fracturas

```typescript
export const fractureTree: DecisionTree = {
  id: 'fracture-tree',
  name: 'Posible Fractura',
  description: 'Evaluación de lesión ósea',
  category: 'trauma',
  startNodeId: 'check-deformity',
  nodes: {
    'check-deformity': {
      id: 'check-deformity',
      type: 'question',
      question: '¿El hueso se ve torcido o deformado?',
      options: [
        {
          id: 'deformed-yes',
          label: 'SÍ, se ve deformado',
          nextNodeId: 'severe-fracture',
          keywords: ['si', 'sí', 'torcido', 'deformado']
        },
        {
          id: 'deformed-no',
          label: 'NO, se ve normal',
          nextNodeId: 'check-movement',
          keywords: ['no', 'normal']
        }
      ]
    },
    'severe-fracture': {
      id: 'severe-fracture',
      type: 'emergency',
      level: 'URGENTE',
      question: '🚨 POSIBLE FRACTURA SERIA',
      immediateAction: '1. NO mover 2. Inmovilizar 3. LLAMAR 911',
      protocolId: 'esguince', // Reutilizar protocolo similar
      context: 'Fractura con desplazamiento. Riesgo de lesión nerviosa.'
    },
    'check-movement': {
      id: 'check-movement',
      type: 'question',
      question: '¿Puede mover la parte lesionada sin dolor extremo?',
      options: [
        {
          id: 'can-move',
          label: 'SÍ, puede moverla',
          nextNodeId: 'minor-injury',
          keywords: ['si', 'sí', 'puede']
        },
        {
          id: 'cannot-move',
          label: 'NO puede o duele mucho',
          nextNodeId: 'probable-fracture',
          keywords: ['no', 'duele', 'dolor']
        }
      ]
    },
    'minor-injury': {
      id: 'minor-injury',
      type: 'protocol',
      level: 'MODERADA',
      question: 'Posible esguince o contusión',
      protocolId: 'esguince',
      immediateAction: 'Aplicar RICE: Reposo, Hielo, Compresión, Elevación'
    },
    'probable-fracture': {
      id: 'probable-fracture',
      type: 'emergency',
      level: 'URGENTE',
      question: '⚠️ PROBABLE FRACTURA',
      immediateAction: 'Inmovilizar + ir a emergencias',
      protocolId: 'esguince',
      context: 'Aunque no se vea deformado, puede haber fractura interna.'
    }
  }
};

// No olvides agregarlo a la colección
export const decisionTrees = {
  // ... otros árboles
  'fracture': fractureTree
};

// Y agregar palabras clave
const treeKeywords = {
  // ... otros keywords
  fracture: ['fractura', 'hueso', 'roto', 'quebrado', 'crack']
};
```

## 🔧 Integración con el Chat

El chat detecta automáticamente:
1. Si el mensaje coincide con keywords → **Activa árbol específico**
2. Si no hay coincidencia → **Usa RAG normal**
3. Si está en modo árbol → **Navega según respuestas**

## 📱 Experiencia del Usuario

```
Usuario: "Me rompí el dedo"
Bot: 🌳 Modo Guiado Activado
     Te guiaré con preguntas para Posible Fractura
     
     ¿El dedo se ve torcido o deformado?
     1. SÍ, se ve deformado
     2. NO, se ve normal
     
Usuario: "1"
Bot: 🚨 POSIBLE FRACTURA SERIA
     ⚡ ACCIÓN INMEDIATA:
     1. NO mover
     2. Inmovilizar
     3. LLAMAR 911
     
     [Protocolo completo...]
```

## 🎯 Mejores Prácticas

1. **Mantén preguntas cortas** - Máximo 10 palabras
2. **Opciones claras** - 2-4 opciones por pregunta
3. **Keywords abundantes** - Mínimo 3-5 por opción
4. **Estructura lógica** - De general a específico
5. **Emergencias primero** - Evalúa riesgo vital al inicio
6. **Reutiliza protocolos** - Usa IDs de protocolos existentes

## 📚 Recursos

- Ver: `data/decisionTrees.ts` - Árboles existentes
- Ver: `services/decisionTreeEngine.ts` - Motor de navegación
- Ver: `app/screens/chat.tsx` - Integración con chat

## ✨ Casos de Uso Ideales

- ✅ Emergencias médicas (síntomas → diagnóstico)
- ✅ Triaje de gravedad (leve → moderado → crítico)
- ✅ Decisiones binarias (¿Sí o No?)
- ✅ Flujos con pasos obligatorios
- ❌ Preguntas abiertas complejas
- ❌ Conversación libre
