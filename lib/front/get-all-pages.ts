import pMemoize from 'p-memoize'
import { getAllPagesInSpace } from 'notion-utils'

import * as types from 'types'
import { notion } from './notion'
import { getCanonicalPageId } from 'lib/renderer/get-canonical-page-id'

export const getAllPagesImpl = async (
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<types.SiteMap>> => {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion)
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid: false
      })

      if (map[canonicalPageId]) {
        console.error(
          'error duplicate canonical page id',
          canonicalPageId,
          pageId,
          map[canonicalPageId]
        )

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId
        }
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}

export const getAllPages = pMemoize(getAllPagesImpl)
