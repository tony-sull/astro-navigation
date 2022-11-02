# astro-navigation

## 0.3.0

### Minor Changes

- a4f11af: feat: adds support for .astro pages :rocket:

## 0.2.1

### Patch Changes

- f5192e2: fix: fixes dependency graph

## 0.2.0

### Minor Changes

- 3b7ca3d: fixes a mismatch between "name" and "title" frontmatter naming.

### Patch Changes

- ee4fd2b: chore: linter fixes
- 51c0395: `@type` is now defaulted to "WebPage" when not provided in a page's frontmatter
- d44cff3: Fixes a link in the package.json metadata
- 881aef2: fix: navigation.permalink frontmatter was being ignored

## 0.1.2

### Patch Changes

- 0f8d703: Updates package metadata for NPM deployments

## 0.1.1

### Patch Changes

- 1e98d8a: Always include the WebPage ld+json schema in <Navigation />

## 0.1.0

### Minor Changes

- 21ec11c: Updates the components to handle globbing `/src/content/pages` internally, no more passing your own `Astro.glob()` results!
- e1076b9: Adds a new `<Pagination>` component for next/previous links
