module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  printWidth: 120,
  semi: false,
  singleQuote: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
