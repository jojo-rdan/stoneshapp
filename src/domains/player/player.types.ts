export type BuildDiscipline = 'espada-escudo' | 'lanza' | 'arco' | 'piromancia' | 'hibrido';

export type PlaystylePreference = 'seguridad' | 'equilibrio' | 'farmeo';

export type PlayerProfile = {
  id: string;
  nickname: string;
  buildName: string;
  discipline: BuildDiscipline;
  level: number;
  homeRegion: string;
  playstyle: PlaystylePreference;
  preferredBiomes: string[];
  strengths: string[];
  weakPoints: string[];
  goals: string[];
  activePreparationPresetId: string;
  notes: string;
};

