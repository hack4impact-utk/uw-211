module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm exec tsc --noEmit',

  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js)': (filenames) => [
    `pnpm exec eslint ${filenames.join(' ')}`,
    `pnpm exec prettier --write ${filenames.join(' ')}`,
  ],

  // Prettify only Markdown and JSON files
  '**/*.(md|json)': (filenames) =>
    `pnpm exec prettier --write ${filenames.join(' ')}`,
};
