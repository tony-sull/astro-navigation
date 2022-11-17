// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import Breadcrumbs from './src/Breadcrumbs.astro'
import Navigation from './src/Navigation.astro'
import Pagination from './src/Pagination.astro'
import Schema from './src/Schema.astro'
import TableOfContents from './src/TableOfContents.astro'
export { fetchPage, fetchPages, findBreadcrumbEntries, findNavigationEntries, findPaginationEntries } from './src/utils.js'
export type { Entry, Page, WebPage } from './src/utils.js'

export default Navigation
export { Breadcrumbs, Navigation, Pagination, Schema, TableOfContents }
