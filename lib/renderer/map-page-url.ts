import { ExtendedRecordMap } from 'notion-types'
import { uuidToId, parsePageId } from 'notion-utils'

import { Site } from 'types'
import { getCanonicalPageId } from './get-canonical-page-id'

export const mapPageUrl =
  (site: Site, recordMap: ExtendedRecordMap, searchParams: URLSearchParams) =>
  (pageId = '') => {
    if (uuidToId(pageId) === site.rootNotionPageId) {
      return createUrl('/', searchParams)
    } else {
      return createUrl(
        `/${getCanonicalPageId(pageId, recordMap, { uuid: false })}`,
        searchParams
      )
    }
  }

export const getCanonicalPageUrl =
  (site: Site, recordMap: ExtendedRecordMap) =>
  (pageId = '') => {
    const pageUuid = parsePageId(pageId, { uuid: true })

    if (uuidToId(pageId) === site.rootNotionPageId) {
      return `https://${site.domain}`
    } else {
      return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
        uuid: false
      })}`
    }
  }

function createUrl(path: string, searchParams: URLSearchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?')
}
