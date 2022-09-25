/// <reference types="astro/astro-jsx" />
import type { MarkdownInstance, MDXInstance } from 'astro'
import { DepGraph } from 'dependency-graph'

export type HTMLAttributes = Omit<astroHTML.JSX.HTMLAttributes, keyof astroHTML.JSX.IntrinsicAttributes>

export interface PageFrontmatter {
  title: string
  excerpt?: string
  permalink?: string
  navigation?: {
    order: number
    title?: string
  }
}

export interface Entry {
  title: string
  excerpt?: string
  url: string
  order: number
  parentKey?: string
  children?: Entry[]
}

export type Page = MarkdownInstance<PageFrontmatter> | MDXInstance<PageFrontmatter>

function getParentKey(url: string) {
  const segments = url.split('/')

  if (segments.length === 1) return undefined
  return segments.slice(0, segments.length - 1).join('/')
}

export function findNavigationEntries(nodes: Page[] = [], key = '') {
  let pages: Entry[] = []

  for (const entry of nodes) {
    if (entry.frontmatter.navigation) {
      const nav = entry.frontmatter.navigation
      const url = entry.frontmatter.permalink || entry.url
      if (!url) {
        // TODO: console warning?
        continue
      }
      const parent = getParentKey(url)
      if ((!key && !parent) || parent === key) {
        pages.push({
          ...nav,
          title: entry.frontmatter.title,
          excerpt: entry.frontmatter.excerpt,
          url,
        })
      }
    }
  }

  return pages
    .sort((a, b) => a.order - b.order)
    .map((entry) => {
      if (entry.url) {
        entry.children = findNavigationEntries(nodes, entry.url)
      }

      return entry
    })
}

function findDependencies(pages: Entry[], depGraph: DepGraph<Entry>, parentKey?: string) {
  for (let page of pages) {
    depGraph.addNode(page.url, page)
    if (parentKey) {
      depGraph.addDependency(page.url, parentKey)
    }
    if (page.children) {
      findDependencies(page.children, depGraph, page.url)
    }
  }
}

function getDependencyGraph(nodes: Page[] = []) {
  let pages = findNavigationEntries(nodes)
  let graph = new DepGraph<Entry>()
  findDependencies(pages, graph)
  return graph
}

export function findBreadcrumbEntries(
  nodes: Page[],
  activeKey: string,
  options: { includeSelf: boolean } = { includeSelf: true }
) {
  let graph = getDependencyGraph(nodes)
  if (!graph.hasNode(activeKey)) {
    // Fail gracefully if the key isn't in the graph
    return []
  }
  let deps = graph.dependenciesOf(activeKey)
  if (options.includeSelf) {
    deps.push(activeKey)
  }

  return activeKey
    ? deps.map((key) => {
        let data = Object.assign({}, graph.getNodeData(key))
        delete data.children
        return data
      })
    : []
}

export function findPaginationEntries(
  nodes: Page[],
  activeKey: string
): { next?: Entry, prev?: Entry } {
  const entries = findNavigationEntries(nodes)

  function walk(node: Entry): Entry[] {
    return node.children?.length
      ? [node, ...node.children.map(walk).flat()]
      : [node]
  }

  const flatEntries = entries.map(walk).flat()

  const index = flatEntries.findIndex(({ url }) => url === activeKey)

  const next = index <= flatEntries.length - 1 ? flatEntries[index + 1] : undefined
  const prev = index > 0 ? flatEntries[index - 1] : undefined

  return { next, prev }
}