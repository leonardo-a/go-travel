module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'expo-router/babel',
      [
        'module-resolver',
        {
          alias: {
            '@components': './components',
            '@assets': './assets',
            '@utils': './utils',
            '@libs': './libs',
            '@contexts': './contexts',
            '@services': './services',
            '@interfaces': './interfaces',
          },
        },
      ],
    ],
  }
}
