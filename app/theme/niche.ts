// Niche design tokens — matches the HTML prototype palette exactly.

export const N = {
  // surfaces
  stone:    '#F7F5F0',
  sand:     '#EDE9E1',
  sandWarm: '#E4DECF',
  // accents
  sage:     '#1D9E75',
  sageDeep: '#155F47',
  sageMist: '#E1F5EE',
  coral:    '#F0997B',
  coralDeep:'#C8704F',
  blush:    '#FAECE7',
  // text
  ink:      '#2C2B26',
  muted:    '#8A8880',
  faint:    '#B8B5AB',
  // borders
  border:   '#E0DDD5',
  edge:     '#EAE7DF',
  // ease
  ease:     [0.32, 0.72, 0.24, 1] as [number, number, number, number],
} as const
