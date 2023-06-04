import { CollectionEntry, getCollection } from 'astro:content'
import { DepGraph } from 'dependency-graph'

export type Entry = {
  title: string
  excerpt?: string
  url: string
  order: number
  parentKey?: string
  children?: Entry[]
}

export type Collection = Parameters<typeof getCollection>[0]
type CollectionEntries = CollectionEntry<Collection>[]

export async function fetchPages(collection: Collection) {
  const pages = await getCollection(collection)

  console.log('fetchPages::', pages.map((page) => `${page.slug}, ${JSON.stringify(page.data)}`))
  return pages
}

export async function fetchPage(collection: Collection, pathname: string) {
  const page = (await fetchPages(collection)).find(
    ({ data, slug }) => (data.navigation?.permalink || slug) === pathname
  )

  if (!page) {
    return undefined
  }

  delete page.data.navigation

  return page
}

function getParentKey(url: string) {
  const segments = url.split('/')

  if (segments.length === 1) return undefined
  return segments.slice(0, segments.length - 1).join('/')
}

export async function findNavigationEntries<C extends Collection>(
  collection: C,
  current?: CollectionEntries,
  key = ''
) {
  const nodes = !!current ? current : await fetchPages(collection)

  let pages: Entry[] = []

  for (const entry of nodes) {
    if (entry.data.navigation) {
      const nav = entry.data.navigation
      const url = nav?.permalink || entry.slug
      if (!url) {
        // TODO: console warning?
        continue
      }
      const parent = getParentKey(url)
      if ((!key && !parent) || parent === key) {
        pages.push({
          ...nav,
          title: entry.data.title.toString(),
          excerpt: entry.data.excerpt?.toString(),
          url,
        })
      }
    }
  }

  return await Promise.all(
    pages
      .sort((a, b) => a.order - b.order)
      .map(async (entry) => {
        if (entry.url) {
          entry.children = await findNavigationEntries(collection, nodes, entry.url)
        }

        return entry
      })
  )
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

async function getDependencyGraph<C extends Collection>(collection: C, nodes: CollectionEntries = []) {
  let pages = await findNavigationEntries(collection, nodes)
  let graph = new DepGraph<Entry>()
  findDependencies(pages, graph)
  return graph
}

export async function findBreadcrumbEntries<C extends Collection>(
  collection: C,
  activeKey: string,
  options: { includeSelf: boolean } = { includeSelf: true }
) {
  let graph = await getDependencyGraph(collection, await fetchPages(collection))
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

export async function findPaginationEntries<C extends Collection>(collection: C, activeKey: string): Promise<{ next?: Entry; prev?: Entry }> {
  const entries = await findNavigationEntries(collection, await fetchPages(collection))

  function walk(node: Entry): Entry[] {
    return node.children?.length ? [node, ...node.children.map(walk).flat()] : [node]
  }

  const flatEntries = entries.map(walk).flat()

  const index = flatEntries.findIndex(({ url }) => url === activeKey)

  const next = index <= flatEntries.length - 1 ? flatEntries[index + 1] : undefined
  const prev = index > 0 ? flatEntries[index - 1] : undefined

  return { next, prev }
}