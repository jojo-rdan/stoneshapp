import type { PlayerProfile } from '@/domains/player/player.types';
import type {
  PreparationChecklistItem,
  PreparationChecklistResult,
  PreparationPreset,
  PreparationRunInput,
} from '@/domains/preparation/preparation.types';

type MockChecklistContext = {
  profile: PlayerProfile;
  preset?: PreparationPreset;
};

function createItem(label: string, reason: string): PreparationChecklistItem {
  return {
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    reason,
  };
}

function pushUnique(items: PreparationChecklistItem[], nextItem: PreparationChecklistItem) {
  if (!items.some((item) => item.label === nextItem.label)) {
    items.push(nextItem);
  }
}

export function generateMockChecklist(
  input: PreparationRunInput,
  context: MockChecklistContext,
): PreparationChecklistResult {
  const essentials: PreparationChecklistItem[] = [
    createItem('Vendas', 'Base segura para resolver dano sostenido.'),
    createItem('Comida', 'Evita quedarte sin margen en una salida larga.'),
  ];
  const recommended: PreparationChecklistItem[] = [];
  const optional: PreparationChecklistItem[] = [];
  const alerts: string[] = [];

  if (context.preset) {
    context.preset.supplies.slice(0, 2).forEach((supply) => {
      pushUnique(essentials, createItem(`${supply.name} ${supply.quantity}`, supply.reason));
    });
  }

  if (input.usesMagic) {
    pushUnique(recommended, createItem('Recurso de energia', 'Si usas magia, conviene asegurar recuperacion extra.'));
  }

  if (input.distance === 'larga' || !input.caravanNearby) {
    pushUnique(essentials, createItem('Raciones extra', 'Una ruta larga o sin caravana necesita mas autonomia.'));
    pushUnique(recommended, createItem('Kit de reparacion', 'Reduce el riesgo de volver antes de tiempo.'));
  }

  if (input.dungeonType === 'catacumbas' || input.dungeonType === 'cripta') {
    pushUnique(recommended, createItem('Antidoto o hierbas', 'Suelen aparecer efectos molestos en dungeons cerradas.'));
  }

  if (input.runType === 'contrato') {
    pushUnique(recommended, createItem('Espacio para botin', 'Los contratos suelen premiar mejor si vuelves con margen de carga.'));
  }

  if (input.playstyle === 'seguro') {
    pushUnique(essentials, createItem('Curacion de respaldo', 'Tu estilo prioriza aguante y margen de error.'));
  }

  if (input.playstyle === 'arriesgado') {
    pushUnique(optional, createItem('Consumible ofensivo', 'Puede acelerar la run, pero no es prioridad en el MVP.'));
  }

  if (input.mainWeapon === 'arco' || input.mainWeapon === 'baston') {
    pushUnique(recommended, createItem('Municion o foco secundario', 'Tu arma principal necesita soporte para no perder ritmo.'));
  }

  if (input.freeSlots < 3) {
    alerts.push('Tienes pocos espacios libres; conviene vaciar inventario antes de salir.');
  }

  if (input.level < 5 && input.dungeonType === 'cripta') {
    alerts.push('La cripta puede castigar bastante para un nivel bajo si entras sin margen.');
  }

  if (!input.caravanNearby) {
    alerts.push('No hay caravana cerca, asi que el costo de retirarte temprano es mayor.');
  }

  optional.push(
    createItem('Nota de ruta', 'Sirve para recordar una salida segura o una prioridad de loot.'),
    createItem('Hueco de emergencia', 'Un espacio reservado evita tener que descartar algo valioso.'),
  );

  return {
    essentials,
    recommended,
    optional,
    alerts,
    explanation: `${context.profile.nickname} juega ${input.build} con enfoque ${input.playstyle}. Esta checklist mock combina el preset del perfil con reglas simples de distancia, dungeon y autonomia para dejar lista la futura integracion con el recommendation engine real.`,
  };
}
