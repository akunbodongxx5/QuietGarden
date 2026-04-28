export type AmbientTrack = {
  id: string;
  label: string;
  emoji: string;
  uri: string;
};

export const AMBIENT_TRACKS: AmbientTrack[] = [
  {
    id: 'rain_forest',
    label: 'Hujan Hutan',
    emoji: '🌧',
    uri: 'https://actions.google.com/sounds/v1/water/rain_on_a_forest.ogg',
  },
  {
    id: 'stream',
    label: 'Aliran Sungai',
    emoji: '💧',
    uri: 'https://actions.google.com/sounds/v1/water/stream.ogg',
  },
  {
    id: 'campfire',
    label: 'Api Unggun',
    emoji: '🔥',
    uri: 'https://actions.google.com/sounds/v1/fire/campfire.ogg',
  },
  {
    id: 'wind',
    label: 'Angin Lembut',
    emoji: '🍃',
    uri: 'https://actions.google.com/sounds/v1/weather/light_wind.ogg',
  },
  {
    id: 'ocean',
    label: 'Ombak Laut',
    emoji: '🌊',
    uri: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg',
  },
];

// Backward compat
export const AMBIENT_DEMO_URI = AMBIENT_TRACKS[0].uri;
