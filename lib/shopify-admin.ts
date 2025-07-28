import { createAdminApiClient } from '@shopify/admin-api-client'
export const getShopify = () => {
  const hostName = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN

  if (!hostName) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN environment variable is not set')
  }

  if (!accessToken) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN environment variable is not set')
  }

  return createAdminApiClient({
    accessToken: accessToken,
    storeDomain: hostName,
    apiVersion: '2025-07',
  })
}
