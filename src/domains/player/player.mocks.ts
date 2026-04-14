import type { PlayerProfile } from '@/domains/player/player.types';

export const activePlayerProfileId = 'profile-alden-guardia';

export const playerProfiles: PlayerProfile[] = [
  {
    id: 'profile-alden-guardia',
    nickname: 'Alden',
    buildName: 'Guardia de Mannshire',
    discipline: 'espada-escudo',
    level: 9,
    homeRegion: 'Mannshire',
    playstyle: 'seguridad',
    preferredBiomes: ['Catacumbas', 'Fortines', 'Criptas cortas'],
    strengths: ['Mitigacion estable', 'Buen aguante', 'Recuperacion consistente'],
    weakPoints: ['Movilidad baja', 'Consumo alto de reparacion'],
    goals: [
      'Optimizar preparacion para dungeons medianas',
      'Registrar contratos con explicaciones claras en espanol',
      'Mantener una ruta segura de progreso para runs largas',
    ],
    activePreparationPresetId: 'preset-seguro-mannshire',
    notes: 'Perfil pensado para entradas seguras, control de riesgo y buena lectura del contrato antes de salir.',
  },
  {
    id: 'profile-lyra-exploradora',
    nickname: 'Lyra',
    buildName: 'Exploradora de Brynn',
    discipline: 'arco',
    level: 7,
    homeRegion: 'Brynn',
    playstyle: 'equilibrio',
    preferredBiomes: ['Ruinas', 'Campamentos', 'Criptas abiertas'],
    strengths: ['Kiteo limpio', 'Cobertura a distancia', 'Exploracion rapida'],
    weakPoints: ['Menos margen si la run se cierra', 'Dependencia de posicionamiento'],
    goals: [
      'Reducir el gasto de consumibles por salida',
      'Construir presets por tipo de enemigo',
    ],
    activePreparationPresetId: 'preset-equilibrado-brynn',
    notes: 'Buen perfil alternativo para cuando el jugador quiera contrastar decisiones del recomendador.',
  },
];

