import { createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

const meleeWeapons = new Set(['espada', 'hacha', 'lanza', 'daga']);

export const buildRules: RecommendationRule[] = [
  ({ input, addItem, addSummaryNote }) => {
    if (meleeWeapons.has(input.mainWeapon)) {
      addItem(
        'recommended',
        createItem(
          'melee-repair-kit',
          'Kit de reparacion',
          'reparacion',
          'media',
          'Las builds melee suelen gastar durabilidad y dependen de mantener arma/armadura en buen estado.',
          'x1',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'melee-pain-control',
          'Soporte contra dolor',
          'curacion',
          'media',
          'Entrar cuerpo a cuerpo aumenta la probabilidad de recibir dano repetido y penalizaciones acumuladas.',
          'x1',
        ),
      );
      addSummaryNote('Arma melee: se refuerza curacion y mantenimiento de equipo.');
    }

    if (input.mainWeapon === 'arco') {
      addItem(
        'essentials',
        createItem(
          'ranged-ammo-check',
          'Municion suficiente',
          'combate',
          'alta',
          'Una build de arco puede perder control de la run si se queda sin municion antes del objetivo.',
          'x1 lote',
        ),
      );
      addItem(
        'optional',
        createItem(
          'ranged-backup-tool',
          'Arma secundaria ligera',
          'combate',
          'media',
          'Sirve como plan B si una sala obliga a pelear demasiado cerca.',
        ),
      );
    }

    if (input.usesMagic || input.mainWeapon === 'baston') {
      addItem(
        'recommended',
        createItem(
          'caster-energy-sustain',
          'Sustain de energia',
          'magia',
          'alta',
          'Las builds con magia necesitan recursos para no quedar atrapadas sin energia en peleas largas.',
          'x1',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'caster-safe-retreat',
          'Herramienta de retirada',
          'escape',
          'media',
          'Un caster sin posicion segura necesita una salida limpia cuando la pelea se acerca demasiado.',
          'x1',
        ),
      );
      addSummaryNote('Uso de magia: se agrega sustain y plan de retirada.');
    }
  },
];
