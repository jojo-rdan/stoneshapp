# Recommendation engine v1

Stoneshapp usa un motor local basado en reglas para generar checklist de preparacion.
No usa IA y no depende de React.

## Ubicacion

```text
src/features/dungeon-prep/recommendation-engine/
|-- index.ts
|-- types.ts
|-- helpers.ts
|-- adapters.ts
`-- rules/
```

## API publica

```ts
generatePreparationRecommendation(input): RecommendationResult
```

El input tipado incluye:

- nivel
- build tipo
- arma principal
- usa magia
- tipo de salida
- distancia
- dungeon conocida o desconocida
- tipo de dungeon
- caravana cerca
- estilo de juego
- espacios libres

## Output

El resultado se divide en:

- `essentials`
- `recommended`
- `optional`
- `alerts`
- `summary`

Cada recomendacion incluye:

- `label`
- `quantity`
- `severity`
- `category`
- `explanation`

## Reglas v1

- `coreSafetyRules`: base de seguridad y nivel bajo.
- `buildRules`: melee, arco y caster.
- `routeRules`: distancia y caravana.
- `dungeonRules`: dungeon desconocida y tipos de dungeon.
- `playstyleRules`: estilo seguro, equilibrado o arriesgado.
- `inventoryRules`: espacios libres.
- `runTypeRules`: contrato, exploracion, farmeo y jefe.

## Integracion UI

La pantalla `Preparar salida` usa un adapter:

- `mapRunInputToRecommendationInput`
- `mapRecommendationToChecklistResult`

Asi la UI no conoce la estructura interna del engine y el motor puede evolucionar por versiones.
