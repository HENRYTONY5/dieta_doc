# Diagramas Técnicos - Chat de Primeros Auxilios

Este paquete contiene diagramas visuales del módulo de chat para documentación de ingeniería.

## Contenido

1. **Flujo funcional end-to-end**  
   Archivo: [01_flujo_chat.mmd](01_flujo_chat.mmd)

2. **Arquitectura lógica**  
   Archivo: [02_arquitectura_chat.mmd](02_arquitectura_chat.mmd)

3. **UML de secuencia (caso crítico)**  
   Archivo: [03_secuencia_caso_critico.mmd](03_secuencia_caso_critico.mmd)

4. **UML de estados**  
   Archivo: [04_estados_chat.mmd](04_estados_chat.mmd)

5. **UML de clases**  
   Archivo: [05_clases_chat.mmd](05_clases_chat.mmd)

6. **Diagrama de componentes**  
   Archivo: [06_componentes_chat.mmd](06_componentes_chat.mmd)

---

## Uso recomendado en GitHub

GitHub renderiza Mermaid en archivos Markdown con bloque `mermaid`.  
Si quieres verlos embebidos directamente, puedes copiar el contenido `.mmd` dentro de un `.md` así:

```markdown
```mermaid
flowchart TD
  A --> B
```
```

---

## Cobertura de ingeniería

Estos diagramas cubren:

- Flujo de conversación e intake clínico
- Detección de emergencias y desambiguación
- Integración RAG + Gemini + fallback
- Persistencia en Firestore
- Diseño estático (clases/componentes) y dinámico (secuencia/estados)
