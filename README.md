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

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/HENRYTONY5/dieta_doc.git
   cd dieta_doc
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copia los archivos de configuración:
     - `FIREBASE_CONFIG.md` - Configuración de Firebase
     - `GEMINI_API_KEY.md` - API Key de Google Gemini
   - Actualiza los valores en `config/firebase.ts`

4. **Iniciar la aplicación**
   ```bash
   npx expo start
   ```

   En la salida encontrarás opciones para:
   - Emulador de Android
   - Simulador de iOS
   - Expo Go (sandbox rápido)
   - Web browser

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
