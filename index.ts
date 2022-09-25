// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import Breadcrumbs from './src/Breadcrumbs.astro'
import Navigation from './src/Navigation.astro'
import Pagination from './src/Pagination.astro'
export type { WebPage } from './src/utils.js'

export default Navigation
export { Breadcrumbs, Pagination }