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
    text:               '#F0EBE2',
    textSecondary:      '#9A9087',
    textMuted:          '#6A6058',
    background:         '#1A1815',   // warm near-black
    backgroundElevated: '#252220',
    backgroundDim:      '#1E1C19',
    tint:               '#5AADA7',
    tabIconDefault:     '#7A7068',
    tabIconSelected:    '#5AADA7',
    accent:             '#C88590',
    border:             '#3A3530',

    sage:               '#7A9B7D',
    sageDark:           '#9DBD9F',
    sageMuted:          '#587A5C',
    sageMist:           '#1E2E1F',

    cream:              '#1A1815',
    beige:              '#252220',
    wash:               '#201E1B',

    blueMist:           '#1E2E2D',
    blueWash:           '#263634',
    blueSoft:           '#5AADA7',
    blueDeep:           '#5AADA7',

    gold:               '#C8A870',
    goldLight:          '#3A3020',

    rose:               '#C88590',
    roseMist:           '#2E1E20',

    zenCard:            '#1E2E2D',
    zenFocus:           '#5AADA7',
  },
} as const;

export type ColorSchemeName = 'light' | 'dark';
