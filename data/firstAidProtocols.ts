// Base de datos de protocolos de primeros auxilios
// Cada protocolo incluye información detallada y palabras clave para búsqueda

export interface FirstAidProtocol {
  id: string;
  title: string;
  keywords: string[]; // Palabras clave para búsqueda
  level: 'CRÍTICA' | 'URGENTE' | 'MODERADA' | 'LEVE';
  stabilizationTime: number; // Minutos
  description: string;
  symptoms: string[];
  steps: string[];
  warnings: string[];
  whenToCall911: string[];
  relatedConditions: string[];
  category: 'trauma' | 'respiratorio' | 'cardiovascular' | 'quemadura' | 'envenenamiento' | 'neurologico' | 'otro';
}

export const firstAidProtocols: FirstAidProtocol[] = [
  {
    id: 'dedo-machucado',
    title: 'Dedo Machucado o Golpe en Dedo',
    keywords: ['dedo', 'machucado', 'golpe', 'mano', 'aplastado', 'martillo', 'puerta', 'morado', 'hinchado', 'uña'],
    level: 'LEVE',
    stabilizationTime: 15,
    category: 'trauma',
    description: 'Lesión en el dedo causada por impacto, aplastamiento o golpe directo.',
    symptoms: [
      'Dolor intenso en el dedo',
      'Hinchazón',
      'Moretón o coloración morada',
      'Dificultad para mover el dedo',
      'Posible sangrado debajo de la uña'
    ],
    steps: [
      'Aplicar hielo envuelto en tela (NUNCA directo en la piel) por 15-20 minutos',
      'Elevar la mano por encima del nivel del corazón',
      'Si hay hinchazón, aplicar compresión suave con venda',
      'Revisar la movilidad del dedo moviendo suavemente',
      'Tomar analgésico común (paracetamol o ibuprofeno) según indicaciones',
      'Mantener el dedo en reposo por 24-48 horas'
    ],
    warnings: [
      'NO aplicar hielo directamente sobre la piel (puede causar quemaduras)',
      'NO forzar el movimiento si hay dolor severo',
      'NO ignorar si la uña se desprende o hay sangrado abundante'
    ],
    whenToCall911: [
      'El dedo está deformado o torcido',
      'No puede mover el dedo en absoluto',
      'Hay un corte profundo con sangrado abundante',
      'El dolor es insoportable después de 30 minutos',
      'La uña está completamente desprendida'
    ],
    relatedConditions: ['fractura', 'luxación', 'esguince de dedo', 'hematoma subungueal']
  },
  {
    id: 'cortada-herida',
    title: 'Cortada o Herida con Sangrado',
    keywords: ['cortada', 'corte', 'herida', 'sangrado', 'sangre', 'cuchillo', 'vidrio', 'navaja', 'laceración'],
    level: 'MODERADA',
    stabilizationTime: 10,
    category: 'trauma',
    description: 'Lesión en la piel que causa sangrado, puede ser superficial o profunda.',
    symptoms: [
      'Sangrado activo',
      'Dolor en el área afectada',
      'Piel abierta o rasgada',
      'Posible exposición de tejido profundo'
    ],
    steps: [
      'Lavar las manos antes de tocar la herida si es posible',
      'Presionar directamente sobre la herida con tela limpia o gasa',
      'Mantener presión constante durante 10 minutos SIN levantar',
      'Elevar la parte herida por encima del corazón',
      'Si la sangre atraviesa la tela, NO quitar - agregar más encima',
      'Una vez detenido el sangrado, limpiar con agua y jabón suave',
      'Aplicar pomada antibiótica si está disponible',
      'Cubrir con venda o curita limpia'
    ],
    warnings: [
      'NO quitar la primera tela aplicada (puede reactivar sangrado)',
      'NO usar torniquete a menos que sea hemorragia severa',
      'NO limpiar con alcohol o peróxido en heridas profundas'
    ],
    whenToCall911: [
      'La sangre sale a chorros o pulsátil',
      'El sangrado no se detiene después de 15 minutos de presión',
      'La herida es muy profunda o ancha (más de 1 cm)',
      'Hay un objeto incrustado en la herida',
      'La herida está en la cara, cuello, pecho o abdomen',
      'Se puede ver músculo, hueso o grasa'
    ],
    relatedConditions: ['hemorragia', 'laceración profunda', 'infección de herida']
  },
  {
    id: 'quemadura',
    title: 'Quemadura Térmica',
    keywords: ['quemadura', 'quemado', 'fuego', 'calor', 'ampolla', 'vapor', 'aceite caliente', 'plancha', 'estufa'],
    level: 'MODERADA',
    stabilizationTime: 20,
    category: 'quemadura',
    description: 'Lesión en la piel causada por calor, fuego, líquidos calientes o superficies calientes.',
    symptoms: [
      'Dolor intenso en el área',
      'Enrojecimiento de la piel',
      'Ampollas (no reventar)',
      'Piel blanca o carbonizada (quemadura grave)',
      'Hinchazón'
    ],
    steps: [
      'Alejar inmediatamente de la fuente de calor',
      'Enfriar con agua fría (NO helada) durante 10-20 minutos',
      'NUNCA usar hielo directamente',
      'NO reventar las ampollas - protegen contra infección',
      'Quitar joyas y ropa suelta ANTES de que se hinche',
      'Cubrir con gasa estéril húmeda SIN apretar',
      'Tomar analgésico para el dolor',
      'Mantener el área elevada si es posible'
    ],
    warnings: [
      'NO aplicar hielo directamente',
      'NO usar mantequilla, aceite, pasta dental o remedios caseros',
      'NO reventar ampollas',
      'NO quitar ropa pegada a la piel'
    ],
    whenToCall911: [
      'La quemadura es más grande que la palma de la mano',
      'Está en la cara, manos, pies, genitales o articulaciones',
      'La piel está blanca, carbonizada o sin dolor (quemadura profunda)',
      'Es causada por electricidad o químicos',
      'La persona es menor de 5 años o mayor de 70 años',
      'Hay dificultad para respirar (posible inhalación de humo)'
    ],
    relatedConditions: ['quemadura eléctrica', 'quemadura química', 'inhalación de humo']
  },
  {
    id: 'persona-inconsciente',
    title: 'Persona Inconsciente',
    keywords: ['inconsciente', 'desmayo', 'no responde', 'no despierta', 'coma', 'dormido', 'paro'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'neurologico',
    description: 'Persona que no responde a estímulos verbales o físicos.',
    symptoms: [
      'No responde cuando se le habla',
      'No responde al dolor (pellizco)',
      'Ojos cerrados sin reacción',
      'Posible respiración irregular o ausente'
    ],
    steps: [
      '¡LLAMAR 911 INMEDIATAMENTE antes de hacer cualquier otra cosa!',
      'Verificar si respira: VER el pecho, OÍR la respiración, SENTIR el aire',
      'Si NO respira: iniciar RCP inmediatamente (30 compresiones, 2 respiraciones)',
      'Si SÍ respira: colocar en posición lateral de seguridad (de lado)',
      'Aflojar ropa apretada (cinturón, corbata, collar)',
      'NO dar nada de comer o beber',
      'Monitorear respiración constantemente hasta que llegue ayuda',
      'Si vomita: mantener vías respiratorias despejadas'
    ],
    warnings: [
      'NO mover si hay sospecha de lesión de columna (accidente grave)',
      'NO dar agua o comida aunque despierte',
      'NO dejar sola en ningún momento',
      'NO cachetear para despertar'
    ],
    whenToCall911: [
      'SIEMPRE - Esta es una EMERGENCIA CRÍTICA',
      'Toda persona inconsciente necesita atención médica INMEDIATA'
    ],
    relatedConditions: ['desmayo', 'síncope', 'convulsión', 'ACV', 'paro cardíaco', 'shock']
  },
  {
    id: 'atragantamiento',
    title: 'Atragantamiento',
    keywords: ['atragantamiento', 'ahogo', 'no respira', 'comida atorada', 'asfixia', 'heimlich', 'atragantado'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'respiratorio',
    description: 'Obstrucción de las vías respiratorias por objeto o alimento.',
    symptoms: [
      'No puede hablar o toser',
      'Se lleva las manos al cuello (señal universal)',
      'Piel azulada o morada',
      'No puede respirar o respiración muy débil',
      'Pánico evidente'
    ],
    steps: [
      'Preguntar: "¿Te estás ahogando?" - Si NO puede hablar, es CRÍTICO',
      'Si puede toser: animarlo a toser fuerte - NO hacer nada más',
      'Si NO puede toser o hablar: MANIOBRA DE HEIMLICH inmediatamente',
      'Heimlich: pararse detrás, brazos alrededor cintura, puño entre ombligo y costillas',
      'Dar 5 golpes fuertes entre los omóplatos (espalda)',
      'Luego 5 compresiones abdominales (hacia arriba y adentro)',
      'Alternar golpes y compresiones hasta expulsar objeto',
      'Si pierde consciencia: iniciar RCP y llamar 911',
      'Revisar boca entre series - quitar objeto SOLO si es visible'
    ],
    warnings: [
      'NO golpear la espalda si la persona puede toser',
      'NO hacer compresiones abdominales en embarazadas (hacer en el pecho)',
      'NO meter dedos a ciegas en la boca (puede empujar objeto más adentro)'
    ],
    whenToCall911: [
      'La persona pierde consciencia',
      'No se puede expulsar el objeto en 2 minutos',
      'Después de expulsar si hubo pérdida de consciencia',
      'En bebés o embarazadas'
    ],
    relatedConditions: ['asfixia', 'paro respiratorio', 'obstrucción de vía aérea']
  },
  {
    id: 'esguince',
    title: 'Esguince de Tobillo o Muñeca',
    keywords: ['esguince', 'torcedura', 'tobillo', 'muñeca', 'hinchado', 'morado', 'ligamento', 'dolor articulación'],
    level: 'MODERADA',
    stabilizationTime: 20,
    category: 'trauma',
    description: 'Lesión de los ligamentos por movimiento brusco o torcedura.',
    symptoms: [
      'Dolor intenso al mover o apoyar',
      'Hinchazón rápida',
      'Moretón o coloración',
      'Incapacidad para usar la articulación',
      'Sensación de inestabilidad'
    ],
    steps: [
      'Aplicar método RICE inmediatamente',
      'R (Rest): Reposo absoluto - NO usar la articulación',
      'I (Ice): Hielo envuelto 20 minutos cada 2-3 horas',
      'C (Compression): Vendaje compresivo (NO demasiado apretado)',
      'E (Elevation): Elevar por encima del corazón',
      'Tomar antiinflamatorio (ibuprofeno) según indicaciones',
      'NO apoyar peso en las primeras 48 horas',
      'Usar muletas si es tobillo'
    ],
    warnings: [
      'NO aplicar calor en las primeras 48 horas',
      'NO masajear el área',
      'NO vendarc demasiado apretado (puede cortar circulación)',
      'NO ignorar si el dolor aumenta'
    ],
    whenToCall911: [
      'La articulación se ve deformada',
      'Hay un sonido de "crack" al momento de la lesión',
      'No puede mover los dedos o no siente la extremidad',
      'El dolor es insoportable',
      'La hinchazón es severa en minutos'
    ],
    relatedConditions: ['fractura', 'luxación', 'desgarro de ligamento']
  },
  {
    id: 'shock-alergico',
    title: 'Reacción Alérgica Severa / Anafilaxia',
    keywords: ['alergia', 'anafilaxia', 'shock', 'hinchazón', 'picadura', 'abejas', 'cacahuate', 'no respira', 'epipen'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'otro',
    description: 'Reacción alérgica severa que puede ser mortal.',
    symptoms: [
      'Dificultad para respirar o tragar',
      'Hinchazón de cara, labios, lengua o garganta',
      'Urticaria o ronchas en todo el cuerpo',
      'Mareo o desmayo',
      'Náuseas o vómito',
      'Pulso rápido y débil',
      'Sensación de muerte inminente'
    ],
    steps: [
      '¡LLAMAR 911 INMEDIATAMENTE!',
      'Si tiene EpiPen (epinefrina): aplicar INMEDIATAMENTE en muslo',
      'Acostar a la persona (elevar piernas si hay mareo)',
      'Aflojar ropa apretada',
      'Si vomita: girar de lado para evitar asfixia',
      'Dar antihistamínico si está consciente y puede tragar',
      'Monitorear respiración constantemente',
      'Estar listo para iniciar RCP si pierde consciencia',
      'Puede necesitar segunda dosis de EpiPen a los 5-15 minutos'
    ],
    warnings: [
      'NO esperar a ver si mejora - actuar INMEDIATAMENTE',
      'NO dar nada de beber si hay dificultad para tragar',
      'NO asumir que el antihistamínico es suficiente'
    ],
    whenToCall911: [
      'SIEMPRE - Esta es una EMERGENCIA CRÍTICA',
      'Cualquier síntoma de anafilaxia requiere atención inmediata',
      'Incluso si se usa EpiPen, SIEMPRE llamar 911'
    ],
    relatedConditions: ['alergia alimentaria', 'picadura de insecto', 'shock anafiláctico']
  },
  {
    id: 'hemorragia-nasal',
    title: 'Hemorragia Nasal (Sangrado de Nariz)',
    keywords: ['nariz', 'sangrado nasal', 'hemorragia nasal', 'sangre nariz', 'epistaxis'],
    level: 'LEVE',
    stabilizationTime: 15,
    category: 'trauma',
    description: 'Sangrado por las fosas nasales.',
    symptoms: [
      'Sangre saliendo por una o ambas fosas nasales',
      'Puede haber sangre en la garganta',
      'Posible mareo si es abundante'
    ],
    steps: [
      'Sentarse inclinado HACIA ADELANTE (NO hacia atrás)',
      'Presionar la parte blanda de la nariz (aletas) con dedos',
      'Mantener presión constante durante 10 minutos SIN soltar',
      'Respirar por la boca',
      'Aplicar hielo envuelto en el puente de la nariz',
      'NO sonarse la nariz por 12 horas después',
      'Evitar esfuerzos físicos por 24 horas'
    ],
    warnings: [
      'NO inclinar la cabeza hacia atrás (la sangre va a garganta/estómago)',
      'NO meter papel o algodón dentro de la nariz',
      'NO soltar la presión antes de 10 minutos'
    ],
    whenToCall911: [
      'El sangrado no se detiene después de 20 minutos de presión',
      'Es causado por un golpe fuerte en la cabeza',
      'Hay dificultad para respirar',
      'Hay sangrado excesivo que causa debilidad o mareo',
      'Ocurre en persona con problemas de coagulación'
    ],
    relatedConditions: ['trauma nasal', 'fractura nasal', 'hipertensión']
  },
  {
    id: 'convulsion',
    title: 'Convulsión o Ataque Epiléptico',
    keywords: ['convulsión', 'ataque', 'epilepsia', 'temblor', 'espasmo', 'se sacude', 'crisis'],
    level: 'URGENTE',
    stabilizationTime: 5,
    category: 'neurologico',
    description: 'Actividad eléctrica anormal en el cerebro que causa movimientos involuntarios.',
    symptoms: [
      'Movimientos bruscos e incontrolables',
      'Pérdida de consciencia',
      'Rigidez muscular',
      'Posible mordedura de lengua',
      'Puede perder control de vejiga',
      'Confusión después del episodio'
    ],
    steps: [
      'Proteger a la persona de lesiones - mover objetos peligrosos',
      'Colocar algo suave bajo la cabeza',
      'Aflojar ropa alrededor del cuello',
      'Girar de lado si es posible (evitar asfixia con saliva)',
      'Cronometrar duración de la convulsión',
      'NO intentar detener los movimientos',
      'NO meter nada en la boca',
      'Quedarse con la persona hasta que esté completamente consciente',
      'Hablarle calmadamente cuando despierte'
    ],
    warnings: [
      'NO meter dedos, cuchara o nada en la boca',
      'NO intentar detener los movimientos sujetando',
      'NO dar agua o comida hasta que esté completamente alerta',
      'NO dejar sola después del episodio'
    ],
    whenToCall911: [
      'Es la primera convulsión de la persona',
      'Dura más de 5 minutos',
      'Tiene otra convulsión inmediatamente después',
      'No recupera consciencia después de 10 minutos',
      'Ocurre en agua (piscina, bañera)',
      'Está embarazada',
      'Hay lesión durante la convulsión'
    ],
    relatedConditions: ['epilepsia', 'fiebre alta en niños', 'traumatismo craneal']
  },
  {
    id: 'intoxicacion',
    title: 'Intoxicación o Envenenamiento',
    keywords: ['intoxicación', 'envenenamiento', 'veneno', 'tóxico', 'comió', 'bebió', 'químico', 'medicamento'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'envenenamiento',
    description: 'Ingesta, inhalación o contacto con sustancia tóxica.',
    symptoms: [
      'Náuseas y vómito',
      'Dolor abdominal',
      'Dificultad para respirar',
      'Confusión o mareo',
      'Convulsiones',
      'Pérdida de consciencia',
      'Quemaduras en boca o piel'
    ],
    steps: [
      '¡LLAMAR AL CENTRO DE TOXICOLOGÍA INMEDIATAMENTE!',
      'Tener a mano el envase del producto si es posible',
      'Si está consciente: mantener sentado',
      'NO inducir vómito a menos que lo indique el centro de toxicología',
      'Si hay vómito: guardar muestra para análisis',
      'Si es en piel: enjuagar con agua abundante por 15-20 minutos',
      'Si es en ojos: enjuagar con agua limpia por 15 minutos',
      'Mantener vías respiratorias despejadas',
      'Estar listo para RCP'
    ],
    warnings: [
      'NO inducir vómito sin autorización médica',
      'NO dar leche o aceite (puede empeorar)',
      'NO usar remedios caseros',
      'NO esperar a que aparezcan síntomas'
    ],
    whenToCall911: [
      'Hay dificultad para respirar',
      'Está inconsciente o semiconsciente',
      'Tiene convulsiones',
      'Es un niño pequeño',
      'Ingirió mucha cantidad',
      'Es producto altamente tóxico (lejía, pesticida, etc.)'
    ],
    relatedConditions: ['sobredosis de medicamento', 'intoxicación alimentaria', 'exposición química']
  },
  {
    id: 'fractura-hueso',
    title: 'Fractura de Hueso',
    keywords: ['fractura', 'heso roto', 'quebrado', 'crack', 'chasquido', 'costilla', 'brazo', 'pierna', 'pelvis'],
    level: 'URGENTE',
    stabilizationTime: 30,
    category: 'trauma',
    description: 'Ruptura total o parcial de un hueso.',
    symptoms: [
      'Deformidad del área',
      'Dolor intenso y progresivo',
      'Hinchazón rápida',
      'Incapacidad para mover la extremidad',
      'Sonido de "crack" durante la lesión',
      'Posible salida de hueso a través de la piel (fractura expuesta)',
      'Entumecimiento u hormigueo'
    ],
    steps: [
      'No mover la extremidad lesionada',
      'Elevar ligeramente por encima del nivel del corazón',
      'Aplicar compresa fría (hielo envuelto) durante 20 minutos',
      'Inmovilizar con cabestrillo, vendaje o férula',
      'Usar antiinflamatorio si está disponible',
      'Monitor de circulación: verificar color, temperatura, sensibilidad',
      'Si es fractura expuesta: cubrir con gasa limpia, NO limpiar',
      'Estar listo para RCP'
    ],
    warnings: [
      'NO intentar enderezar el hueso roto',
      'NO mover más de lo necesario',
      'NO ignorar si adormece o se pone azulada'
    ],
    whenToCall911: [
      'La fractura es expuesta (se ve el hueso)',
      'El área está muy deforme',
      'Hay adormecimiento u hormigueo intenso',
      'La piel está azulada o pálida',
      'Es fractura de pelvis, cadera o fémur',
      'Hay trauma grave (accidente automovilístico)'
    ],
    relatedConditions: ['luxación', 'esguince severo', 'trauma vascular']
  },
  {
    id: 'luxacion',
    title: 'Luxación o Dislocación de Articulación',
    keywords: ['luxación', 'dislocación', 'desencajado', 'hombro', 'rodilla', 'codo', 'cadera', 'dedo'],
    level: 'URGENTE',
    stabilizationTime: 20,
    category: 'trauma',
    description: 'Desplazamiento completo de un hueso fuera de su articulación.',
    symptoms: [
      'Deformidad severa de la articulación',
      'Dolor extremo',
      'Imposibilidad de mover la extremidad',
      'Hinchazón rápida',
      'Piel estirada sobre el hueso',
      'Posible adormecimiento'
    ],
    steps: [
      'LLAMAR 911 inmediatamente',
      'Inmovilizar en posición de encontrada',
      'NO intentar reposicionar (solo médico entrenado)',
      'Aplicar hielo envuelto durante 20 minutos',
      'Elevar legalmente por encima del corazón',
      'Monitorear circulación constantemente',
      'Calmar a la persona y esperar ayuda'
    ],
    warnings: [
      'NO intentar "meter de nuevo" la articulación',
      'NO mover innecesariamente',
      'NO ignorar cambios en color o temperatura'
    ],
    whenToCall911: [
      'SIEMPRE - Esta es una lesión que requiere reducción médica'
    ],
    relatedConditions: ['fractura asociada', 'daño nervioso', 'daño vascular']
  },
  {
    id: 'dolor-pecho',
    title: 'Dolor en el Pecho (Posible Infarto)',
    keywords: ['dolor pecho', 'corazón', 'infarto', 'ataque cardíaco', 'angina', 'presión pecho', 'ardor'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'cardiovascular',
    description: 'Dolor o presión en el pecho que podría indicar un evento cardíaco.',
    symptoms: [
      'Presión o dolor en el pecho',
      'Dolor en brazo izquierdo, cuello o quijada',
      'Falta de aire',
      'Sudoración profusa',
      'Náuseas',
      'Sensación de pánico o muerte inminente',
      'Mareo'
    ],
    steps: [
      '¡LLAMAR 911 INMEDIATAMENTE! (No conducir)',
      'Acostar a la persona',
      'Aflojarse ropa apretada',
      'Calmar y tranquilizar',
      'Si la persona tiene aspirina: darle 300-325 mg a masticar',
      'Si está disponible nitroglicerina: usar según prescripción',
      'Monitorear respiración y consciencia',
      'Estar listo para RCP',
      'Darle información médica a la ambulancia'
    ],
    warnings: [
      'NO ignorar - SIEMPRE es una emergencia',
      'NO conducir al hospital (esperar ambulancia)',
      'NO administrar medicamentos sin saber la dosis correcta'
    ],
    whenToCall911: [
      'SIEMPRE - Todo dolor de pecho es potencialmente cardíaco',
      'Especialmente si hay otros síntomas (sudor, falta de aire, dolor en brazo)'
    ],
    relatedConditions: ['infarto agudo', 'angina', 'disección aórtica', 'embolia pulmonar']
  },
  {
    id: 'accidente-cerebrovascular',
    title: 'Accidente Cerebrovascular (ACV) / Ictus',
    keywords: ['acv', 'ictus', 'infarto cerebral', 'derrame', 'brazo caído', 'habla rara', 'face-arms-speech'],
    level: 'CRÍTICA',
    stabilizationTime: 0,
    category: 'neurologico',
    description: 'Interrupción del flujo sanguíneo en el cerebro.',
    symptoms: [
      'Debilidad súbita en cara, brazo o pierna',
      'Caída de un lado de la cara',
      'Dificultad para hablar o entender',
      'Visión borrosa o pérdida de visión',
      'Mareo o pérdida del equilibrio',
      'Dolor de cabeza severo sin causa conocida'
    ],
    steps: [
      '¡LLAMAR 911 INMEDIATAMENTE! (Cada minuto cuenta)',
      'Anotar la hora exacta del inicio de síntomas',
      'Acostar a la persona',
      'Si está consciente: girar de lado (evitar asfixia)',
      'NO dar comida o bebida',
      'Mantener vías respiratorias despejadas',
      'Monitorear respiración y consciencia',
      'Dar información temporal exacta a los paramédicos',
      'Estar listo para RCP'
    ],
    warnings: [
      'NO esperar - Primera 3-4 horas son críticas para tratamiento',
      'NO dar nada de comer o beber',
      'NO mover innecesariamente'
    ],
    whenToCall911: [
      'SIEMPRE - ACV es una emergencia quirúrgica del tiempo'
    ],
    relatedConditions: ['hemiplejia', 'afasia', 'edema cerebral']
  },
  {
    id: 'hipotermia',
    title: 'Hipotermia (Frío Severo)',
    keywords: ['frío', 'congelación', 'hipotermia', 'temperatura baja', 'temblando', 'confusión', 'nieve'],
    level: 'CRÍTICA',
    stabilizationTime: 30,
    category: 'otro',
    description: 'Disminución crítica de la temperatura corporal.',
    symptoms: [
      'Escalofríos severos',
      'Confusión mental',
      'Somnolencia o letargo',
      'Piel pálida y fría',
      'Movimientos lentos',
      'Pode haber inconsciencia',
      'En casos severos: apariencia de muerte (sin pulso aparente)'
    ],
    steps: [
      'Llamar 911 INMEDIATAMENTE',
      'Trasladar a lugar cálido lentamente',
      'NO hacer movimientos bruscos (riesgo de paro cardíaco)',
      'Quitar ropas mojadas suavemente',
      'Envolvicar en mantas secas',
      'NO frotar la piel (causa más pérdida de calor)',
      'NO dar alcohol o cafeína',
      'Monitorear pulso y respiración',
      'Si respira: colocar en posición de recuperación',
      'Estar listo para RCP prolongado'
    ],
    warnings: [
      'NO hacer movimientos abruptos',
      'NO dar bebidas calientes',
      'NO intentar recalentar rápido (causa shock)',
      'NO asumir que está muerto'
    ],
    whenToCall911: [
      'SIEMPRE - Toda hipotermia severa es emergencia'
    ],
    relatedConditions: ['frostbite', 'shock'],
  },
  {
    id: 'golpe-calor',
    title: 'Golpe de Calor (Hipertermia)',
    keywords: ['calor', 'insolación', 'fiebre alta', 'golpe de calor', 'agotamiento por calor', 'confundido por calor'],
    level: 'URGENTE',
    stabilizationTime: 20,
    category: 'otro',
    description: 'Elevación peligrosa de la temperatura corporal por exposición al calor.',
    symptoms: [
      'Temperatura corporal > 40°C (104°F)',
      'Piel roja, caliente y seca (o muy sudada)',
      'Confusión o comportamiento extraño',
      'Dolor de cabeza severo',
      'Pulsaciones rápidas',
      'Posible pérdida de consciencia',
      'Convulsiones posibles'
    ],
    steps: [
      'Si es leve: mover a sombra, beber agua lentamente',
      'Si es severo: LLAMAR 911',
      'Enfriar el cuerpo INMEDIATAMENTE:',
      '- Aplicar agua fría o hielo a: cuello, axilas, ingles',
      '- Mojar ropa y abanicarse',
      '- Introducir en bañera fría si es posible',
      'NO hielo directo (evita shock)',
      'Darle agua si está consciente',
      'Si pierde consciencia: posición de recuperación'
    ],
    warnings: [
      'NO esperar - el daño comienza rápido',
      'NO darle alcohol',
      'NO ponerlo en forma vertical de inmediato si mejora'
    ],
    whenToCall911: [
      'Temperatura muy elevada',
      'Confusión o comportamiento extraño',
      'Síntomas que no mejoran en 30 minutos',
      'Hay convulsiones'
    ],
    relatedConditions: ['deshidratación', 'quemadura solar', 'agotamiento']
  },
  {
    id: 'picadura-insecto',
    title: 'Picadura o Mordedura de Insecto/Animal',
    keywords: ['picadura', 'avispa', 'abeja', 'araña', 'mosquito', 'serpiente', 'mordedura', 'aguijón'],
    level: 'MODERADA',
    stabilizationTime: 20,
    category: 'otro',
    description: 'Lesión por picadura o mordedura de animal o insecto.',
    symptoms: [
      'Hinchazón local',
      'Picor en zona',
      'Dolor',
      'Enrojecimiento',
      'Posible reacción alérgica (ver Anafilaxia)'
    ],
    steps: [
      'Lavar el área con agua y jabón',
      'Si es agujón visible: raspar (NO pellizcar)',
      'Aplicar compresa fría los primero 20 minutos',
      'Aplicar crema antihistamínica',
      'NO rascar (previene infección)',
      'Tomar antihistamínico oral si está disponible',
      'Elevar si es en extremidad',
      'Si se propaga mucha inflamación: llamar médico'
    ],
    warnings: [
      'NO extraer con pinzas (puede inyectar más veneno)',
      'NO rascar',
      'Monitorear por reacción alérgica'
    ],
    whenToCall911: [
      'Hay signos de reacción alérgica (ver Anafilaxia)',
      'Es mordedura de serpiente venenosa',
      'Hay síntomas sistémicos (debilidad, dificultad para respirar)'
    ],
    relatedConditions: ['reacción alérgica', 'infección local', 'anafilaxia']
  },
  {
    id: 'trauma-abdominal',
    title: 'Trauma Abdominal',
    keywords: ['golpe abdomen', 'vientre', 'estómago', 'trauma abdominal', 'intestinos', 'sangrado interno'],
    level: 'URGENTE',
    stabilizationTime: 10,
    category: 'trauma',
    description: 'Lesión en el abdomen que puede afectar órganos internos.',
    symptoms: [
      'Dolor abdominal',
      'Hinchazón abdominal',
      'Sangrado en heces o vómito con sangre',
      'Posible salida de órganos',
      'Moretones',
      'Shock (piel fría, pulso rápido, confusión)'
    ],
    steps: [
      'LLAMAR 911 INMEDIATAMENTE',
      'Acostar con piernas elevadas 30 cm',
      'NO dar comida o bebida',
      'NO presionar el área lesionada',
      'Si hay salida de órganos: cubrir con gasa estéril húmeda (NO meter)',
      'Monitorear respiración y consciencia',
      'Estar listo para RCP',
      'Dar información exacta a la ambulancia'
    ],
    warnings: [
      'NO asumir que no es grave porque no hay sangrado externo',
      'NO presionar o manipular',
      'NO permitir que se mueva mucho'
    ],
    whenToCall911: [
      'SIEMPRE - Todo trauma abdominal potencialmente grave'
    ],
    relatedConditions: ['sangrado interno', 'peritonitis', 'shock'],
  },
  {
    id: 'trauma-craneal',
    title: 'Trauma Craneal o Lesión en la Cabeza',
    keywords: ['golpe cabeza', 'conmoción', 'trauma cráneano', 'accidente cabeza', 'pérdida consciencia'],
    level: 'URGENTE',
    stabilizationTime: 10,
    category: 'trauma',
    description: 'Lesión en la cabeza que puede afectar el cerebro.',
    symptoms: [
      'Pérdida de consciencia (aunque sea breve)',
      'Confusión o desorientación',
      'Dolor de cabeza severo',
      'Náuseas o vómito',
      'Sangrado de oído, nariz o boca',
      'Visión borrosa',
      'Cambio de personalidad',
      'Convulsiones'
    ],
    steps: [
      'LLAMAR 911 si hubo pérdida de consciencia',
      'NO mover el cuello (posible lesión de columna)',
      'Acostar con cabeza elevada levemente',
      'Aplicar hielo si hay hinchazón',
      'Monitorear constantemente',
      'Anotar cambios en comportamiento',
      'NO dormir hasta ser evaluado por médico',
      'Llevara emergencias aunque parezca leve'
    ],
    warnings: [
      'NO mover bruscamente',
      'NO ignorar síntomas que aparezcan después',
      'NO permitir conducir o usar máquinas',
      'NO dormir sin supervisión las primeras 24 horas'
    ],
    whenToCall911: [
      'Pérdida de consciencia',
      'Vómito repetido',
      'Sangrado de óido/nariz',
      'Cambios de comportamiento',
      'Dolor de cabeza severo'
    ],
    relatedConditions: ['conmoción cerebral', 'hemorragia intracraneal', 'fractura de cráneo']
  },
  {
    id: 'dificultad-respirar',
    title: 'Dificultad para Respirar (Disnea)',
    keywords: ['no puede respirar', 'falta aire', 'asmael', 'respiración dificultosa', 'ahogo', 'jadea'],
    level: 'URGENTE',
    stabilizationTime: 5,
    category: 'respiratorio',
    description: 'Dificultad para respirar frecuentemente causada por asma, ansiedad o problemas cardíacos.',
    symptoms: [
      'Respiración rápida o laboriosa',
      'Sibilancias (sonidos silbantes)',
      'Piel azulada en labios o uñas',
      'Incapacidad de hablar frases completas',
      'Pecho apretado',
      'Mareo'
    ],
    steps: [
      'LLAMAR 911 si es severo',
      'Sentar derecho',
      'Aflojar ropa apretada',
      'Si tiene inhalador de asma: usarlo',
      'Respirar lentamente (respiración de caja: 4 adentro, 4 afuera)',
      'Mantener calma',
      'Si no mejora en 5 minutos: ir a emergencias',
      'Monitorear color de piel y consciencia'
    ],
    warnings: [
      'NO asumir que es solo ansiedad',
      'NO ignorar si es también dolor de pecho',
      'Puede ser emergencia'
    ],
    whenToCall911: [
      'Piel azulada',
      'Incapacidad para hablar',
      'Respiración muy rápida o lenta',
      'Dolor de pecho también',
      'No mejora con inhalador'
    ],
    relatedConditions: ['asma', 'pulmonía', 'embolia pulmonar', 'ansiedad severa']
  },
  {
    id: 'hipoglucemia',
    title: 'Crisis Hipoglucémica (Bajo Nivel de Azúcar)',
    keywords: ['azúcar bajo', 'hipoglucemia', 'diabético', 'temblor', 'confusión', 'sudor frío', 'mareo'],
    level: 'URGENTE',
    stabilizationTime: 5,
    category: 'otro',
    description: 'Disminución peligrosa del nivel de glucosa en sangre.',
    symptoms: [
      'Temblor',
      'Sudoración profusa',
      'Confusión o desorientación',
      'Ansiedad o pánico',
      'Mareo o visión borrosa',
      'Debilidad',
      'Posible pérdida de consciencia'
    ],
    steps: [
      'Dar azúcar inmediatamente (si está consciente y puede tragar):',
      '- 15g de azúcar simple (pasas, caramelo, zumo, dona)',
      '- O bebida azucarada (no diet)',
      'Esperar 15 minutos y revisar síntomas',
      'Si no mejora: dar otro 15g',
      'Si sigue inconsciente: LLAMAR 911',
      'Si tiene glucagón: aplicar inyección',
      'Monitorear y alimentar cuando esté consciente'
    ],
    warnings: [
      'NO dar insulina (lo empeoraría)',
      'NO permitir conducir',
      'Actuar RÁPIDO (puede progresar rápidamente)'
    ],
    whenToCall911: [
      'Pérdida de consciencia',
      'Convulsiones',
      'No mejora con azúcar en 15 min',
      'No se sabe si es hipo o hiperglucemia'
    ],
    relatedConditions: ['diabetes tipo 1 y 2', 'sobredosis de insulina']
  },
  {
    id: 'quemadura-quimica',
    title: 'Quemadura Química',
    keywords: ['químico', 'ácido', 'lejía', 'sosa', 'quemadura', 'sustancia química', 'corrosivo'],
    level: 'URGENTE',
    stabilizationTime: 20,
    category: 'quemadura',
    description: 'Lesión por contacto con sustancia química corrosiva.',
    symptoms: [
      'Ardor inmediato',
      'Enrojecimiento severo',
      'Posible pérdida de capa de piel',
      'Olor disparador',
      'Humo posible de la piel',
      'Dolor extremo'
    ],
    steps: [
      'Alejar de la fuente de químico INMEDIATAMENTE',
      'Remover ropa contaminada (con cuidado)',
      'Si es polvo: remover partículas con paño seco',
      'ENJUAGAR PROFUSAMENTE CON AGUA durante 30 minutos mínimo',
      'Si es químico desconocido: enjuagar 45-60 minutos',
      'Cubrir con venda estéril',
      'Si es en cara/globo ocular: enjuagar 15+ minutos',
      'LLAMAR 911 para evaluación'
    ],
    warnings: [
      'NO intentar neutralizar (puede generar calor)',
      'NO tocar la piel dañada',
      'ENJUAGAR BASTANTE - Es lo más importante'
    ],
    whenToCall911: [
      'Área afectada es grande',
      'Incluye ojos o cara',
      'Es químico desconocido o muy tóxico'
    ],
    relatedConditions: ['inhalación de vapores', 'quemadura ocular']
  },
  {
    id: 'electrocucion',
    title: 'Electrocución o Choque Eléctrico',
    keywords: ['electricidad', 'electrocutado', 'cable', '220v', 'rayo', 'shock eléctrico'],
    level: 'URGENTE',
    stabilizationTime: 20,
    category: 'trauma',
    description: 'Lesión por paso de corriente eléctrica a través del cuerpo.',
    symptoms: [
      'Marca de entrada y salida quemada',
      'Piel quemada',
      'Inconsciencia',
      'Paro cardíaco posible',
      'Respiración superficial',
      'Quemaduras internas posibles'
    ],
    steps: [
      'DESCONECTAR LA CORRIENTE de la fuente (NO tocar si está enchufado)',
      'Si no puedes: usar objeto no conductor para separar',
      'Si no hay respuesta: LLAMAR 911',
      'Si está inconsciente pero respira: posición de recuperación',
      'Si NO respira: iniciar RCP',
      'NO mover si hay sospecha de lesión de columna',
      'Enfriar quemaduras con agua',
      'Cubrir con gasa estéril'
    ],
    warnings: [
      'NO tocar a persona mientras esté en contacto con corriente',
      'NO asumir seguridad sin verificar'
    ],
    whenToCall911: [
      'SIEMPRE - Toda electrocución requiere evaluación médica',
      'Puede causar arritmias cardíacas después'
    ],
    relatedConditions: ['paro cardíaco', 'quemadura interna', 'lesión de médula espinal']
  },
  {
    id: 'hemorragia-severa',
    title: 'Hemorragia Severa (Sangrado Profuso)',
    keywords: ['sangrado abundante', 'hemorragia', 'sangre a chorros', 'aplicar torniquete'],
    level: 'CRÍTICA',
    stabilizationTime: 5,
    category: 'trauma',
    description: 'Pérdida de sangre que amenaza la vida.',
    symptoms: [
      'Sangre saliendo rápidamente',
      'Sangre pulsante (arterial)',
      'Debilidad progresiva',
      'Piel pálida y fría',
      'Pulso rápido y débil',
      'Confusión',
      'Posible pérdida de consciencia'
    ],
    steps: [
      '¡LLAMAR 911 INMEDIATAMENTE!',
      'Presionar directamente con gasa limpia - NO LEVANTAR',
      'Si atraviesa: agregar gasa sin remover la primera',
      'Elevar la extremidad POR ENCIMA del corazón',
      'Si sangrado NO se detiene en 10 min: APLICAR TORNIQUETE',
      '- Torniquete 5-10 cm ARRIBA de la herida',
      '- Apretar bastante para DETENER sangrado',
      '- Anotar hora exacta del torniquete',
      'Acostar con piernas elevadas (shock)',
      'Monitorear consciencia y respiración',
      'Estar listo para RCP'
    ],
    warnings: [
      'TIEMPO ES CRÍTICO - Actuar RÁPIDO',
      'NO quitar torniquete una vez puesto',
      'NO intentar limpiar grandes heridas'
    ],
    whenToCall911: [
      'SIEMPRE INMEDIATAMENTE'
    ],
    relatedConditions: ['shock hemorrágico', 'amputación', 'hemorragia interna']
  }
];

// Función para buscar protocolos por palabras clave
export function searchProtocols(query: string): FirstAidProtocol[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return firstAidProtocols
    .filter(protocol => {
      // Buscar coincidencias en keywords, title, symptoms
      const searchableText = [
        ...protocol.keywords,
        protocol.title,
        ...protocol.symptoms,
        protocol.description
      ].join(' ').toLowerCase();
      
      return searchTerms.some(term => searchableText.includes(term));
    })
    .sort((a, b) => {
      // Ordenar por nivel de emergencia (crítica primero)
      const levelOrder = { CRÍTICA: 0, URGENTE: 1, MODERADA: 2, LEVE: 3 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
}
