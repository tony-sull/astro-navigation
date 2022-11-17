/// <reference types="astro/astro-jsx" />
import type { MarkdownInstance, MDXInstance } from 'astro'
import type { HTMLAttributes } from 'astro/types'
import { DepGraph } from 'dependency-graph'
import type * as Schemas from 'schema-dts'

export type RequireSome<T, P extends keyof T> = Omit<T, P> & Required<Pick<T, P>>
export type Optional<T, P extends keyof T> = Omit<T, P> & Partial<Pick<T, P>>

export interface WebPage extends Optional<Schemas.WebPage, 'name'> {
  title: string
  navigation?: {
    order: number
    permalink?: string
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

export type Page = MarkdownInstance<Optional<WebPage, '@type'>> | MDXInstance<Optional<WebPage, '@type'>>

export function fetchPage(pathname: string) {
  const page = fetchPages().find(
    ({ frontmatter, url }) => (frontmatter.navigation?.permalink || frontmatter.url || url) === pathname
  )

  if (!page) {
    return undefined
  }

  delete page.frontmatter.navigation

  return page
}

function fileToUrl(file: string) {
  const start = file.indexOf('/content') + '/content'.length
  const end = file.lastIndexOf('.')
  const path = file
    .substring(start, end)
    .replace(/\/index$/, '')

  return path || '/'
}

export function fetchPages() {
  const results = import.meta.glob<Page>(
    ['/content/**/*.md', '/content/**/*.mdx', '/content/**/*.astro'],
    { eager: true }
  )
  return Object.values<Page>(results).map((page) => ({
    ...page,
    frontmatter: {
      '@type': 'WebPage',
      ...page.frontmatter,
    },
    url: page.url || fileToUrl(page.file),
  })) as Page[]
}

function getParentKey(url: string) {
  const segments = url.split('/')

  if (segments.length === 1) return undefined
  return segments.slice(0, segments.length - 1).join('/')
}

export function findNavigationEntries(nodes: Page[] = fetchPages(), key = '') {
  let pages: Entry[] = []

  for (const entry of nodes) {
    if (entry.frontmatter.navigation) {
      const nav = entry.frontmatter.navigation
      const url = nav?.permalink || entry.frontmatter.url?.toString() || entry.url
      if (!url) {
        // TODO: console warning?
        continue
      }
      const parent = getParentKey(url)
      if ((!key && !parent) || parent === key) {
        pages.push({
          ...nav,
          title: entry.frontmatter.title.toString(),
          excerpt: entry.frontmatter.headline?.toString(),
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

export function findBreadcrumbEntries(activeKey: string, options: { includeSelf: boolean } = { includeSelf: true }) {
  let graph = getDependencyGraph(fetchPages())
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

export function findPaginationEntries(activeKey: string): { next?: Entry; prev?: Entry } {
  const entries = findNavigationEntries(fetchPages())

  function walk(node: Entry): Entry[] {
    return node.children?.length ? [node, ...node.children.map(walk).flat()] : [node]
  }

  const flatEntries = entries.map(walk).flat()

  const index = flatEntries.findIndex(({ url }) => url === activeKey)

  const next = index <= flatEntries.length - 1 ? flatEntries[index + 1] : undefined
  const prev = index > 0 ? flatEntries[index - 1] : undefined

  return { next, prev }
}
