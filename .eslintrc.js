module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:import/recommended'],
  rules: {
    'import/named': ['off'],
    'module-resolver/use-alias': ['error'],
    'jsdoc/no-undefined-types': [
      'warn',
      {
        definedTypes: ['JSX', 'Response', 'RequestInit', 'Blob', 'Readonly'],
      },
    ],
  },
  plugins: ['react', 'react-native', 'module-resolver', 'jsdoc'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
    jsdoc: {
      mode: 'typescript',
    },
  },
  ignorePatterns: ['node_modules/'],
};
