import type { ContractCatalogEntry } from '@/domains/contracts/contract.types';

export const CONTRACT_CATALOG_VERSION = 1;

export const contractCatalog: ContractCatalogEntry[] = [
  {
    id: 'catalog-mannshire-east-catacombs',
    name: 'Limpieza de catacumbas del sendero este',
    region: 'Mannshire',
    issuerNpc: 'Administrador local',
    objectiveType: 'limpieza',
    simpleDescription: 'Una salida bastante didactica para practicar desgaste, ritmo y retirada limpia.',
    detailedDescription:
      'Este contrato suele funcionar bien como primera referencia para jugadores que todavia no quieren improvisar demasiado. La amenaza no viene tanto de un pico de dano absurdo como del desgaste acumulado y de entrar sin curacion bien pensada. Si se aborda con calma, ayuda a entrenar lectura del mapa, control de recursos y criterio para cortar la run a tiempo.',
    steps: [
      'Revisar durabilidad de arma y armadura antes de salir.',
      'Separar la curacion importante en una zona facil del inventario.',
      'Limpiar la entrada y confirmar que el gasto inicial sigue dentro de lo esperado.',
      'Salir si el consumo de vendas escala demasiado pronto.',
    ],
    whatToExpect: [
      'Pasillos estrechos y peleas lentas.',
      'No-muertos con presion sostenida mas que burst.',
      'Botin aceptable si no conviertes la salida en una run demasiado larga.',
    ],
    commonMistakes: [
      'Entrar con inventario demasiado lleno.',
      'Sobrecurarse en los primeros encuentros.',
      'Insistir cuando la run ya dejo de ser rentable.',
    ],
    estimatedRewardGold: 1200,
    tags: ['no-muertos', 'catacumbas', 'aprendizaje', 'desgaste'],
    novicePriority: 'alta',
  },
  {
    id: 'catalog-osbrook-north-bandits',
    name: 'Campamento de bandidos al norte de Osbrook',
    region: 'Osbrook',
    issuerNpc: 'Capitan de la guardia',
    objectiveType: 'bandidos',
    simpleDescription: 'Contrato bueno para farmear con riesgo moderado y buen control del inventario.',
    detailedDescription:
      'La gracia de este contrato es que demuestra que una salida util no tiene que sentirse heroica todo el tiempo. El trayecto es razonable, la recompensa suele cubrir bien la inversion y deja espacio para volver a vender relativamente pronto. La clave aqui es disciplina: no sobrellenarse de loot mediocre y no regalar recursos por exceso de confianza.',
    steps: [
      'Salir con espacio suficiente para botin ligero y herramientas utiles.',
      'Priorizar grupos pequenos o enemigos aislados.',
      'Revisar cofres y rutas secundarias solo si el gasto sigue siendo bajo.',
    ],
    whatToExpect: [
      'Humanos con presion moderada.',
      'Buena oportunidad de vender armas y piezas ligeras.',
      'Ruta comoda para una sesion corta o de recuperacion economica.',
    ],
    commonMistakes: [
      'Subestimar grupos medianos.',
      'Llenar el inventario demasiado pronto.',
      'Gastar herramientas en desvio con poco retorno.',
    ],
    estimatedRewardGold: 850,
    tags: ['bandidos', 'farm', 'economia', 'osbrook'],
    novicePriority: 'alta',
  },
  {
    id: 'catalog-brynn-old-crypt',
    name: 'Cripta antigua del cementerio viejo',
    region: 'Brynn',
    issuerNpc: 'Escribano de Brynn',
    objectiveType: 'investigacion',
    simpleDescription: 'Contrato mas exigente, con mejor recompensa y mucha menos tolerancia a errores.',
    detailedDescription:
      'La cripta de Brynn es el tipo de contrato que parece tentador por la recompensa, pero castiga durisimo la improvisacion. Conviene tratarla como una salida que exige autonomia, paciencia y un criterio claro para retirarse. Si la build entra sin margen o con el inventario mal planificado, el costo de sostener la run suele subir demasiado rapido.',
    steps: [
      'Comprar y ordenar consumibles antes de salir de Brynn.',
      'Definir una condicion concreta para retirada antes de entrar.',
      'Asegurar la primera parte sin gastar recursos raros demasiado pronto.',
      'Retirarse si el gasto de curacion supera el plan original.',
    ],
    whatToExpect: [
      'No-muertos con picos de dano mas notorios.',
      'Combate mas largo y mas castigo sobre durabilidad y energia.',
      'Mejor recompensa, pero solo si sostienes una ruta ordenada.',
    ],
    commonMistakes: [
      'Entrar sin plan de escape.',
      'Confundir “posible” con “rentable”.',
      'Gastar consumibles fuertes en encuentros faciles.',
    ],
    estimatedRewardGold: 1850,
    tags: ['cripta', 'brynn', 'alto-riesgo', 'no-muertos'],
    novicePriority: 'evitar',
  },
  {
    id: 'catalog-mannshire-ruins-relic',
    name: 'Recuperacion de reliquia en ruinas del oeste',
    region: 'Mannshire',
    issuerNpc: 'Sacerdote itinerante',
    objectiveType: 'reliquia',
    simpleDescription: 'Salida flexible donde importa tanto llegar como volver con espacio para el objetivo.',
    detailedDescription:
      'Este encargo es menos una prueba de combate puro y mas una prueba de logistica. La reliquia compensa bien, pero el valor real del contrato cae si entras sin espacio libre o si conviertes la ida en una ruta demasiado larga. Es buena referencia para builds que quieran practicar exploracion controlada y decisiones de loot mas frías.',
    steps: [
      'Salir con huecos libres reservados para el objetivo y el botin valioso.',
      'No pelear de mas si la ruta ya cumplio el objetivo principal.',
      'Marcar un punto claro para volver antes de explorar un desvio extra.',
    ],
    whatToExpect: [
      'Exploracion algo mas abierta.',
      'Presion moderada, con valor alto en decisiones de inventario.',
      'Buen retorno si vuelves con prioridad clara de loot.',
    ],
    commonMistakes: [
      'Sobrellenar mochila antes de encontrar la reliquia.',
      'Querer limpiar todo cuando el objetivo ya esta cumplido.',
      'Perder tiempo en desvio poco rentable.',
    ],
    estimatedRewardGold: 980,
    tags: ['ruinas', 'reliquia', 'inventario', 'exploracion'],
    novicePriority: 'media',
  },
  {
    id: 'catalog-osbrook-wolf-hunt',
    name: 'Caza de lobos cerca de la cantera',
    region: 'Osbrook',
    issuerNpc: 'Cazador local',
    objectiveType: 'caza',
    simpleDescription: 'Contrato corto para builds que quieran una salida simple y controlada.',
    detailedDescription:
      'La caza de lobos suele ser una buena puerta de entrada para aprender a no sobreprepararse. La distancia no suele ser dramática y el objetivo es claro, pero aun así castiga ir sin plan si el jugador persigue demasiado o pierde la lectura de posicionamiento. Funciona bien como contrato de calentamiento antes de una salida más cara.',
    steps: [
      'Entrar ligero y con curacion basica, sin llenar el inventario de utilidades innecesarias.',
      'Evitar alargar la persecucion si ya cumpliste el objetivo.',
      'Volver pronto a vender si el retorno ya es correcto.',
    ],
    whatToExpect: [
      'Combate mas movil y menos de pasillo.',
      'Salida corta con recompensa modesta.',
      'Buena oportunidad para ajustar build o probar una herramienta nueva.',
    ],
    commonMistakes: [
      'Sobreinvertir en consumibles caros.',
      'Perseguir de mas cuando la ruta ya cumplio.',
      'Subestimar la movilidad del encuentro.',
    ],
    estimatedRewardGold: 540,
    tags: ['caza', 'osbrook', 'ruta-corta', 'aprendizaje'],
    novicePriority: 'alta',
  },
];
