# Configuración de Firebase - Índices Requeridos

## 🔥 Error: "The query requires an index"

Si ves este error, significa que Firebase necesita crear un índice compuesto para acelerar las consultas.

## ✅ Solución Rápida (Recomendada)

### Opción 1: Usar el link automático
1. Cuando veas el error en la consola del navegador (F12), copia el link completo que empieza con:
   ```
   https://console.firebase.google.com/v1/r/project/ia-diet/firestore/indexes?create_composite=...
   ```

2. Pégalo en tu navegador

3. Firebase te llevará directo a crear el índice necesario

4. Clic en **"Create Index"** o **"Crear índice"**

5. Espera 1-2 minutos mientras se construye

6. Recarga la app

### Opción 2: Crear manualmente
1. Ve a: https://console.firebase.google.com/

2. Selecciona tu proyecto: **ia-diet**

3. En el menú izquierdo: **Firestore Database** → **Indexes** (Índices)

4. Clic en **"Create Index"** (Crear índice)

5. Configura así:
   - **Collection ID**: `chats`
   - **Fields to index**:
     - Campo 1: `userId` - Ascending (Ascendente)
     - Campo 2: `timestamp` - Ascending (Ascendente)
   - **Query scope**: Collection

6. Clic en **Create**

7. Espera 1-2 minutos

## 🛠️ Solución Temporal (Ya Implementada)

Modifiqué el código para que **NO requiera el índice**:
- Ahora la query solo filtra por `userId`
- El ordenamiento se hace en el cliente (en la app)
- Funciona inmediatamente sin crear índice

**Ventajas**: Funciona ya
**Desventajas**: Más lento si tienes miles de mensajes

## 📊 ¿Por qué necesita índices?

Firebase Firestore requiere índices para queries que combinan:
- **WHERE** (filtro) + **ORDER BY** (ordenar)

Antes teníamos:
```typescript
where('userId', '==', user.uid)  // Filtrar por usuario
orderBy('timestamp', 'asc')       // Ordenar por fecha
```

Esto requiere índice compuesto.

Ahora tenemos:
```typescript
where('userId', '==', user.uid)   // Filtrar por usuario
// Ordenar en cliente
```

Esto NO requiere índice.

## 🎯 Recomendación

Para mejor rendimiento:
1. **Crea el índice** siguiendo Opción 1 o 2
2. Una vez creado, puedes volver al código original si quieres

El código actual funciona bien para uso normal (cientos de mensajes).

## ⚠️ Otros índices que podrías necesitar

Si en el futuro quieres hacer queries más complejas, podrías necesitar:

### Buscar mensajes por fecha y tipo
```
Collection: chats
Fields:
- userId: Ascending
- role: Ascending  
- timestamp: Descending
```

### Buscar emergencias críticas
```
Collection: chats
Fields:
- userId: Ascending
- emergencyLevel: Ascending
- timestamp: Descending
```

## 📱 Error 404

Si ves error 404 en la consola, puede ser:
1. **Imagen/recurso faltante**: Revisa que todas las imágenes existan
2. **Ruta incorrecta**: Verifica que las rutas de navegación sean correctas
3. **Firebase reglas**: Asegúrate de que las reglas permitan lectura

Para ver el error específico:
1. Presiona **F12** en el navegador
2. Ve a la pestaña **Console**
3. Busca el error 404 completo
4. Verifica qué archivo no se encuentra

## 🔍 Ver logs completos

En desarrollo web:
```
F12 → Console
```

En React Native:
```
npx react-native log-android  # Android
npx react-native log-ios      # iOS
```

## ✅ Verificar que todo funciona

1. Abre el chat de primeros auxilios
2. Envía un mensaje de prueba: "me duele la cabeza"
3. Debe aparecer respuesta de Gemini
4. Recarga la página
5. El mensaje debe seguir ahí (historial cargado)

Si todo esto funciona: ¡Éxito! ✨
