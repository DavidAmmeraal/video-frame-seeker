export const FRAME_RATES = {
  film: 24,
  NTSC: 29.97,
  NTSC_Film: 23.98,
  NTSC_HD: 59.94,
  PAL: 25,
  PAL_HD: 50,
  web: 30,
  high: 60,
};

export const SEEK_TYPES = Object.freeze([
  'time',
  'seconds',
  'milliseconds',
  'SMPTE',
  'frame',
]);

export const SEEK_TIMEOUT = 2000;

export const INVALID_ELEMENT_ERROR = 'Invalid element given';
export const INVALID_FRAME_RATE_ERROR = 'Invalid framerate given';
export const INVALID_SEEK_TIMEOUT_ERROR = 'Invalid seek timeout given';
