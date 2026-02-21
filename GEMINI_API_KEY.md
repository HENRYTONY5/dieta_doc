# Cómo Obtener tu API Key de Google Gemini (GRATIS)

## ⚠️ IMPORTANTE: La API Key actual puede estar inválida

Si ves error **400 (Bad Request)**, significa que necesitas tu propia API Key.

## 🆓 Gemini es completamente gratuito

Google Gemini ofrece acceso gratuito a su API con límites generosos:
- **60 solicitudes por minuto**
- **1,500 solicitudes por día**
- **Totalmente gratis** (no requiere tarjeta de crédito)

## 📝 Pasos para obtener tu API Key

### 1. Ir a Google AI Studio
Abre tu navegador y ve a:
```
https://makersuite.google.com/app/apikey
```

### 2. Iniciar sesión
- Usa tu cuenta de Google (Gmail)
- Si no tienes, crea una gratis

### 3. Crear API Key
1. Clic en **"Create API Key"** o **"Crear clave de API"**
2. Selecciona un proyecto existente o crea uno nuevo
3. Copia la API Key que aparece en pantalla

### 4. Configurar en la app

Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example`) y agrega:

```bash
EXPO_PUBLIC_GEMINI_API_KEY=TU_GEMINI_API_KEY_AQUI
```

### 5. ¡Listo!
Guarda el archivo y reinicia la app para que tome la variable de entorno.

## ⚠️ Importante

- **NO compartas** tu API Key públicamente
- **NO la subas** a GitHub o repositorios públicos
- Si la expones accidentalmente, ve a Google AI Studio y bórrala
- Puedes crear múltiples API Keys si necesitas

## 🔗 Enlaces útiles

- **Google AI Studio**: https://makersuite.google.com/
- **Documentación Gemini**: https://ai.google.dev/docs
- **Límites de uso**: https://ai.google.dev/pricing

## 🆚 Ventajas vs Ollama Local

| Característica | Gemini (Internet) | Ollama (Local) |
|----------------|-------------------|----------------|
| **Requiere internet** | ✅ Sí | ❌ No |
| **Velocidad** | ⚡ Muy rápido | 🐢 Depende de tu PC |
| **Calidad respuestas** | 🌟 Excelente | ⭐ Buena |
| **Privacidad** | 📡 Envía datos a Google | 🔒 100% privado |
| **Costo** | 🆓 Gratis | 🆓 Gratis |
| **Instalación** | Solo API Key | Descargar Ollama + Modelo |
| **Espacio disco** | 0 MB | 1-5 GB |

## 🔄 Cambiar entre Gemini y Ollama

### Para volver a Ollama local:
1. Abre `app/screens/chat.tsx`
2. Busca la línea 5:
```typescript
import { sendMessageToGemini, checkGeminiStatus } from '@/services/geminiService';
```
3. Cámbiala por:
```typescript
import { sendMessageToDeepSeek, checkOllamaStatus } from '@/services/ollamaService';
```
4. Cambia todas las referencias de `Gemini` a `Ollama`/`DeepSeek` en el archivo

### Para usar Gemini (actual):
Ya está configurado ✅

## 📊 Monitorear uso

Para ver cuántas solicitudes has hecho:
1. Ve a: https://makersuite.google.com/app/apikey
2. Selecciona tu API Key
3. Ve la sección de uso y límites

## ❓ Problemas comunes

### "No se pudo conectar con Gemini"
- Verifica tu conexión a internet
- Revisa que la API Key esté bien copiada
- Asegúrate de que no tenga espacios al inicio/final

### "API Key inválida"
- Genera una nueva en Google AI Studio
- Copia y pega cuidadosamente

### "Límite de solicitudes excedido"
- Espera 1 minuto (límite de 60 por minuto)
- O espera hasta el día siguiente (límite de 1,500 por día)

## 🎯 Recomendación

**Gemini es mejor para:**
- Respuestas más precisas y coherentes
- Cuando tienes internet disponible
- Para uso en emergencias reales

**Ollama es mejor para:**
- Privacidad absoluta
- Sin internet
- Aprender sobre IA local
