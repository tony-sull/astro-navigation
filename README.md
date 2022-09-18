# astro-navigation

A plugin for creating hierarchical navigation in Astro projects. Supports breadcrumbs too!

> Full docs coming soon!

## Basic usage

This packages adds two components useful for building hierarchical navigation in [Astro](https://astro.build).

Just use [Astro.glob()](https://docs.astro.build/en/reference/api-reference/#astroglob) to find your local Markdown and MDX pages, pass them to the `<Navigation />` component and you're all set!

## <Navigation /> component

This is the main component, building the HTML for a sorted navigation menu. Include a bit of frontmatter on each `.md` or `.mdx` page and the component will handle sorting and nesting pages automatically.

In your layout or page, use `Astro.glob()` to find all Markdown or MDX pages that should be included in the navigation menu. The `<Navigation>` component will build the list itself but leaves rendering a `<nav>` element to your app.

```
---
import Navigation from 'astro-navigation'
import type { PageFrontmatter } from 'astro-navigation'

const pages = await Astro.glob<PageFrontmatter>('../content/**/*.md')
---

<nav aria-label="Navigation menu" id="navigation">
    <!-- `<ul>` is used by default, this can be overridden with the "as" prop -->
    <Navigation pages={pages} as="ol" />
</nav>

<style is:global>
#navigation ol {
    padding: 0;
}

#navigation li {
    line-height: 2;
}
<style>
```

Each markdown or MDX file should include `navigation.order` in its frontmatter. This order is used to sort sibling pages. Nesting is based on the `url` provided by `Astro.glob()` and can be overridden with a `permalink` frontmatter property, if needed.

```
---
title: Example site # text used in the menu, if `navigation.title` is not provided
permalink: /post-1 # URL for the page, if `url` is not provided by `Astro.glob()`
navigation:
  order: 1 # used to sort sibling pages
  title: My Awesome page # (optional) overrides the `title` frontmatter used above
---

# My awesome page
```

## <Breadcrumbs> component

The API surface for breadcrumbs is very similar. `Astro.glob()` your pages and pass them to the component, it will automatically generate a list of breadcrumbs for the current page. Again, this doesn't render the `<nav>` element since the specific use case varies between sites.

The `<Breadcrumbs>` component will automatically include `ld+json` structured data for your breadcrumbs! This information is often used by search engines to add breadcrumbs to search results.

```
---
import { Breadcrumbs } from 'astro-navigation'
import type { PageFrontmatter } from 'astro-navigation'

const pages = await Astro.glob<PageFrontmatter>('../content/**/*.md')
---

<nav aria-label="Breadcrumbs" id="breadcrumbs">
    <!-- `<ul>` is used by default, this can be overridden with the "as" prop -->
    <Breadcrumbs pages={pages} as="ol" />
</nav>

<style is:global>
#breadcrumbs ol {
    list-style: none;
    display: flex;
    column-gap: 2ch;
}

#breadcrumbs a {
    text-decoration: none;
}

#breadcrumbs a:is(:hover, :focus-visible) {
    text-decoration: underline;
}
</style>
```
