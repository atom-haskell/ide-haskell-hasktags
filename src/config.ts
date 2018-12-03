export const config = {
  hasktagsPath: {
    type: 'string',
    default: 'hasktags.js',
    description: `Path to hasktags executable; if set to 'hasktags.js'
(default) will use bundled ghcjs-powered implementation`,
  },
  ignoreCloseImplementation: {
    type: 'boolean',
    default: 'false',
    description: `Ignore symbols with the same name that are close together
in terms of lines. May require restart.`,
  },
}
