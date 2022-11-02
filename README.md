# astro-navigation

A plugin for creating hierarchical navigation in Astro projects. Supports breadcrumbs and next/previous pagination too!

> Full docs coming soon!

## Basic usage

This packages adds three components useful for building hierarchical navigation in [Astro](https://astro.build). Just write your Markdown and MDX pages in `src/content/pages` and you're all set!

`<Navigation />` builds a sorted hierarchical navigation menu, `<Breadcrumbs />` adds an SEO-friendly breadcrumb list for the current page, and `<Pagination />` adds next/previous navigation links.

## `<Navigation />` component

This is the main component, building the HTML for a sorted navigation menu. Include a bit of frontmatter on each `.md` or `.mdx` page and the component will handle sorting and nesting pages automatically.

The `<Navigation>` component will build the list itself but leaves rendering a `<nav>` element to your app.

### How it works

To build the menu, the `<Navigation />` component:

1. uses `import.meta.glob` to find all `.md` and `.mdx` files in `/src/content/pages`
2. filters down to include only the files that include `navigation.order` frontmatter
3. uses file-based routing similar to Astro's `/src/pages` directory to sort and nest pages in the menu

```
---
import Navigation from 'astro-navigation'
---

<nav aria-label="Navigation menu" id="navigation">
    <!-- `<ol>` is used by default, this can be overridden with the "as" prop -->
    <Navigation as="ul" />
</nav>

<style>
#navigation :global(ul) {
    padding: 0;
}

#navigation :global(li) {
    line-height: 2;
}
<style>
```

Each markdown or MDX file should include `navigation.order` in its frontmatter. This order is used to sort sibling pages. Nesting is based on the `url` provided by `Astro.glob()` and can be overridden with a `navigation.permalink` frontmatter property, if needed.

```
---
title: Example site # text used in the menu, if `navigation.title` is not provided
url: /post-1 # URL for the page, if `url` is not provided by `import.meta.glob()`
navigation:
  order: 1 # used to sort sibling pages
  title: My Awesome page # (optional) overrides the `title` frontmatter used above
---

# My awesome page
```

## `<Breadcrumbs>` component

The API surface for breadcrumbs is very similar. Pages are automatically discovered by using `import.meta.glob` to scan `src/content/pages`. Again, this doesn't render the `<nav>` element since the specific use case varies between sites.

The `<Breadcrumbs>` component will automatically include `ld+json` structured data for your breadcrumbs! This information is often used by search engines to add breadcrumbs to search results.

```
---
import { Breadcrumbs } from 'astro-navigation'
---

<nav aria-label="Breadcrumbs" id="breadcrumbs">
    <Breadcrumbs aria-label="Breadcrumbs" />
</nav>

<style>
#breadcrumbs :global(ol) {
    list-style: none;
    display: flex;
    column-gap: 2ch;
}

#breadcrumbs :global(a) {
    text-decoration: none;
}

#breadcrumbs :glboal(a:is(:hover, :focus-visible)) {
    text-decoration: underline;
}
</style>
```

## `<Pagination>` component

The pagination component will build next/previous links, if available.

```
---
import { Pagination } from 'astro-navigation'
---

<nav aria-label="Pagination navigation">
    <Pagination prevLabel="Go to previous page" nextLabel="Go to next page" />
</nav>

<style>
nav :global(ol) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'prev' 'next';
}

nav :global([aria-label="Go to previous page"]) {
    grid-area: prev;
}

nav :global([aria-label="Go to next page"]) {
    grid-area: next;
}
<style>
```
