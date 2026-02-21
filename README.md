# 🏃‍♂️ Dieta Corre - App de Entrenamiento y Nutrición

Una aplicación móvil moderna desarrollada con **Expo** y **React Native** que proporciona un sistema integral de entrenamiento personalizado, seguimiento de nutrición y asesoramiento mediante IA.

## 📋 Características Principales

- **📅 Calendario de Entrenamientos**: Visualiza y gestiona tu plan de entrenamiento
- **🏋️ Entrenamientos Personalizados**: Entrenamientos adaptados a tu nivel y objetivos
- **🍎 Seguimiento de Nutrición**: Monitorea tu ingesta dietética con recomendaciones personalizadas
- **💬 Chat Inteligente**: Asistente de IA para responder preguntas sobre dieta y entrenamiento
- **📊 Reportes Detallados**: Análisis de tu progreso y métricas de desempeño
- **👤 Perfil Personalizado**: Gestiona tu información y preferencias
- **⚙️ Ajustes Configurables**: Personaliza la app según tus necesidades
- **📱 Mensajes**: Sistema de notificaciones y mensajes para seguimiento

## 🛠️ Stack Tecnológico

- **Framework**: Expo + React Native + TypeScript
- **Routing**: Expo Router (file-based routing)
- **Backend**: Firebase (Firestore, Authentication)
- **IA**: Google Gemini API + Ollama
- **State Management**: React Hooks
- **Styling**: Themed components con soporte light/dark mode

## 📂 Estructura del Proyecto

```
hola_doc/
├── app/                          # Pantallas principales
│   ├── (tabs)/                   # Navegación con tabs
│   │   ├── index.tsx             # Home
│   │   └── explore.tsx           # Exploración
│   ├── screens/                  # Pantallas adicionales
│   │   ├── ajustes.tsx           # Configuración
│   │   ├── calendario.tsx        # Calendario de entrenamientos
│   │   ├── chat.tsx              # Chat con IA
│   │   ├── entrenamiento.tsx     # Detalles de entrenamientos
│   │   ├── mensajes.tsx          # Sistema de mensajes
│   │   ├── perfil.tsx            # Perfil de usuario
│   │   ├── reportes.tsx          # Reportes de progreso
│   │   └── tareas.tsx            # Gestión de tareas
│   ├── dashboard.tsx             # Panel principal
│   ├── login.tsx                 # Autenticación
│   └── _layout.tsx               # Layout principal
├── components/                   # Componentes reutilizables
│   ├── themed-text.tsx           # Texto con tema
│   ├── themed-view.tsx           # Vista con tema
│   ├── parallax-scroll-view.tsx  # Scroll paralaxo
│   └── ui/                       # Componentes UI
├── services/                     # Servicios de la app
│   ├── decisionTreeEngine.ts     # Motor de árboles de decisión
│   ├── geminiService.ts          # Integración con Google Gemini
│   ├── ollamaService.ts          # Integración con Ollama
│   └── knowledgeBase.ts          # Base de conocimiento
├── config/                       # Configuraciones
│   └── firebase.ts               # Configuración de Firebase
├── constants/                    # Constantes
│   └── theme.ts                  # Temas de la app
├── data/                         # Datos estáticos
│   ├── decisionTrees.ts          # Definiciones de árboles de decisión
│   └── firstAidProtocols.ts      # Protocolos de primeros auxilios
├── hooks/                        # Custom hooks
│   ├── use-color-scheme.ts       # Manejo de tema
│   └── use-theme-color.ts        # Colores del tema
└── package.json                  # Dependencias del proyecto
```

## 🚀 Instalación y Configuración

### 📦 Requisitos Previos - Instalación Completa

#### 1. **Node.js y npm**
   - **Versión requerida**: Node.js 18.0.0 o superior
   - **Descargar**: https://nodejs.org/
   - **Verificar instalación**:
     ```bash
     node --version    # Debe ser v18.0.0 o superior
     npm --version     # Debe ser 9.0.0 o superior
     ```

#### 2. **Git**
   - **Sistema Windows**: https://git-scm.com/download/win
   - **Verificar**:
     ```bash
     git --version
     ```

#### 3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   expo --version
   ```

#### 4. **Para Android (Opcional pero Recomendado)**
   - **Android Studio**: https://developer.android.com/studio
   - **Java Development Kit (JDK) 11+**: Incluido en Android Studio
   - **Android SDK**: API level 31 o superior
   - **Variables de entorno** (Windows):
     - `ANDROID_HOME`: C:\Users\[TuUsuario]\AppData\Local\Android\Sdk
     - `JAVA_HOME`: Ruta de tu instalación de JDK

#### 5. **Para iOS (Solo macOS)**
   - **Xcode**: https://apps.apple.com/us/app/xcode/id497799835
   - **CocoaPods**: 
     ```bash
     sudo gem install cocoapods
     ```

#### 6. **Git** (Para Windows)
   - Descargar de: https://git-scm.com/download/win
   - Usar PowerShell o Git Bash

### 📋 Pasos de Instalación Detallados

#### Paso 1: Clonar el Repositorio
```bash
# En tu terminal/PowerShell
git clone https://github.com/HENRYTONY5/dieta_doc.git
cd dieta_doc
```

#### Paso 2: Instalar Dependencias del Proyecto
```bash
# Instalar todas las dependencias de npm
npm install

# Esto instalará automáticamente:
npm list  # Ver todas las dependencias instaladas
```

#### Paso 3: Verificar Instalación
```bash
# Verificar que expo está disponible
npx expo --version

# Verificar estructura del proyecto
dir  # En Windows
ls   # En macOS/Linux
```

#### Paso 4: Configurar Variables de Entorno y APIs

**A. Firebase Configuration**
- Lee el archivo `FIREBASE_CONFIG.md`
- Obtén tus credenciales de Firebase Console: https://console.firebase.google.com/
- Actualiza `config/firebase.ts` con tu configuración:
  ```typescript
  // Ejemplo en config/firebase.ts
  export const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-dominio.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-bucket.appspot.com",
    messagingSenderId: "tu-id",
    appId: "tu-app-id"
  };
  ```

**B. Google Gemini API**
- Lee el archivo `GEMINI_API_KEY.md`
- Crea una API Key en: https://makersuite.google.com/app/apikey
- Crea `.env` (puedes copiar `.env.example`) y configura:
  ```bash
  EXPO_PUBLIC_GEMINI_API_KEY=TU_GEMINI_API_KEY_AQUI
  ```

**C. Ollama (Opcional)**
- Si usarás Ollama localmente: https://ollama.ai/
- Asegúrate de que el servicio esté ejecutándose en `http://localhost:11434`

#### Paso 5: Iniciar la Aplicación
```bash
# Modo desarrollo
npx expo start

# Presiona:
# 'a' para abrir en Android Emulator
# 'i' para abrir en iOS Simulator (solo macOS)
# 'w' para abrir en web browser
# 'j' para Expo DevTools
```

### 📚 Dependencias del Proyecto

#### Dependencias Principales (package.json)
```json
{
  "dependencies": {
    "react": "18.x.x",
    "react-native": "0.73.x",
    "expo": "~50.x.x",
    "expo-router": "~3.x.x",
    "expo-font": "~11.x.x",
    "expo-splash-screen": "~0.26.x",
    "expo-status-bar": "~1.11.x",
    "react-native-gesture-handler": "~2.x.x",
    "react-native-reanimated": "~3.x.x",
    "react-native-screens": "~3.x.x",
    "firebase": "^10.x.x",
    "typescript": "^5.x.x"
  },
  "devDependencies": {
    "@types/react": "^18.x.x",
    "@types/react-native": "^0.73.x",
    "@react-native-community/eslint-config": "^3.x.x",
    "eslint": "^8.x.x"
  }
}
```

### 🔍 Verificación de Instalación

Ejecuta estos comandos para verificar que todo está correcto:

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Expo
npx expo --version

# Listar dependencias instaladas
npm list --depth=0

# Verificar que el proyecto es válido
npx expo doctor
```

### ⚠️ Troubleshooting Común

#### Error: "expo command not found"
```bash
# Solución: Instalar expo-cli globalmente
npm install -g expo-cli
```

#### Error: "No Android Emulator running"
```bash
# Verificar que Android Studio esté instalado
# Abrir Android Studio → Configure → AVD Manager
# Crear un emulador o iniciar uno existente
```

#### Error de Dependencias
```bash
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules y package-lock.json
rm -r node_modules package-lock.json

# Reinstalar
npm install
```

#### Puerto 19000 en uso
```bash
# El puerto 19000 es usado por Expo
# Usar puerto diferente:
npx expo start --port 19001
```

## 🔧 Comandos Disponibles

```bash
# Iniciar desarrollo
npx expo start

# Resetear proyecto (borrar código de ejemplo)
npm run reset-project

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios

# Ejecutar linter
npm run lint
```

## 📚 Servicios y Características Avanzadas

### Decision Tree Engine
Sistema inteligente para flujos de decisión basados en respuestas del usuario.
Ver: [DECISION_TREES_GUIDE.md](DECISION_TREES_GUIDE.md)

### Integración de IA
- **Google Gemini**: IA generativa para asesoramiento personalizado
- **Ollama**: Procesamiento de lenguaje natural offline

### Autenticación
Integrada con Firebase Authentication para login seguro.

## 📖 Documentación Adicional

- [Firebase Configuration](FIREBASE_CONFIG.md) - Configuración de Firebase
- [Gemini API Setup](GEMINI_API_KEY.md) - Setup de API Gemini
- [Decision Trees Guide](DECISION_TREES_GUIDE.md) - Guía de árboles de decisión

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

---

**Desarrollado con ❤️ para tu salud y bienestar**
