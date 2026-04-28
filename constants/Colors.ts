/**
 * Quiet Garden — Total UI Remake
 * Palette: Warm Earthy · Deep Teal · Muted Gold
 * Inspirasi: editorial wellness, Day One, Bear
 */

// ── Backgrounds ────────────────────────────────────────────────────
const parchment   = '#F5EFE4';   // main bg — warm cream
const paperWhite  = '#FFFCF5';   // elevated surface
const clayWash    = '#EDE5D8';   // dimmed surface / section bg

// ── Text ───────────────────────────────────────────────────────────
const inkDark     = '#26211C';   // primary text — warm near-black
const inkMid      = '#7A6E63';   // secondary text
const inkLight    = '#A89E93';   // muted/placeholder

// ── Teal (zen accent, replaces dusty blue) ────────────────────────
const tealDeep    = '#2A6460';   // primary action, buttons
const tealMid     = '#3E8A84';   // hover / active
const tealLight   = '#84BCBA';   // softer accent
const tealMist    = '#E1EFEE';   // chip bg, card tint
const tealWash    = '#C6E0DE';   // selected chip, hover

// ── Gold (warm highlight) ─────────────────────────────────────────
const goldWarm    = '#B8955A';   // accent spark
const goldLight   = '#E8D5A8';   // pill bg

// ── Nature ────────────────────────────────────────────────────────
const sage        = '#5D7A62';   // nature green
const sageMuted   = '#95AE99';
const sageMist    = '#E6F0E7';

// ── Rose (favorites / hearts) ─────────────────────────────────────
const rose        = '#B8757A';
const roseMist    = '#F0E2E3';

// ── Utility ───────────────────────────────────────────────────────
const borderWarm  = '#DDD5C4';

export default {
  light: {
    text:               inkDark,
    textSecondary:      inkMid,
    textMuted:          inkLight,
    background:         parchment,
    backgroundElevated: paperWhite,
    backgroundDim:      clayWash,
    tint:               tealDeep,
    tabIconDefault:     inkMid,
    tabIconSelected:    tealDeep,
    accent:             rose,
    border:             borderWarm,

    // nature
    sage,
    sageDark:           '#3E5942',
    sageMuted,
    sageMist,

    // warm neutrals (compat)
    cream:              parchment,
    beige:              clayWash,
    wash:               '#EEE8DC',

    // teal family
    blueMist:           tealMist,
    blueWash:           tealWash,
    blueSoft:           tealLight,
    blueDeep:           tealDeep,

    // gold
    gold:               goldWarm,
    goldLight,

    // rose
    rose,
    roseMist,

    // zen tokens
    zenCard:            tealMist,
    zenFocus:           tealDeep,
  },

  dark: {
    text:               '#E8EDE8',   // sage-white
    textSecondary:      '#7A9088',   // muted sage
    textMuted:          '#4A5A52',
    background:         '#0C1410',   // deep forest dark
    backgroundElevated: '#141C17',
    backgroundDim:      '#101810',
    tint:               '#7DC4BE',   // moonlit teal
    tabIconDefault:     '#3E5850',
    tabIconSelected:    '#7DC4BE',
    accent:             '#C49096',   // soft rose
    border:             'rgba(125,196,190,0.14)',

    sage:               '#8BA882',
    sageDark:           '#A8C4A0',
    sageMuted:          '#4A6050',
    sageMist:           '#141C16',

    cream:              '#0C1410',
    beige:              '#141C17',
    wash:               '#111814',

    blueMist:           '#141C1A',
    blueWash:           '#1A2822',
    blueSoft:           '#7DC4BE',
    blueDeep:           '#7DC4BE',

    gold:               '#C4A86A',   // candlelight gold
    goldLight:          '#2A2010',

    rose:               '#C49096',
    roseMist:           '#1E1216',

    zenCard:            '#141C1A',
    zenFocus:           '#7DC4BE',
  },
} as const;

export type ColorSchemeName = 'light' | 'dark';
