// Script para inicializar la base de conocimiento en Firebase
// Ejecutar una vez para cargar todos los protocolos

import { initializeKnowledgeBase } from '../services/knowledgeBase';

console.log('🚀 Iniciando carga de base de conocimiento...\n');

initializeKnowledgeBase()
  .then(() => {
    console.log('\n✅ Base de conocimiento cargada exitosamente!');
    console.log('📚 Los protocolos están disponibles para el chatbot.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error al cargar base de conocimiento:', error);
    console.log('\n⚠️ Asegúrate de:');
    console.log('1. Tener Firebase configurado correctamente');
    console.log('2. Tener conexión a internet');
    console.log('3. Tener permisos de escritura en Firestore\n');
    process.exit(1);
  });
