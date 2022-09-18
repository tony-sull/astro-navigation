# Astro Starter Kit: Component Package

This is a template for an Astro component library. Use this template for writing components to use in multiple projects or publish to NPM.

```
npm create astro@latest -- --template component
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/non-html-pages)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── index.ts
├── src
│   └── MyComponent.astro
├── tsconfig.json
├── package.json
```

The `index.ts` file is the "entry point" for your package. Export your components in `index.ts` to make them importable from your package.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command       | Action                                                                                                                                                                                                                           |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm link`    | Registers this package locally. Run `npm link my-component-library` in an Astro project to install your components                                                                                                               |
| `npm publish` | [Publishes](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages#publishing-unscoped-public-packages) this package to NPM. Requires you to be [logged in](https://docs.npmjs.com/cli/v8/commands/npm-adduser) |
