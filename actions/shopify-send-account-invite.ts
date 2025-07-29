'use server'
import { getShopify } from '@/lib/shopify-admin'

export async function shopifySendAccountInvite(id: string) {
  const client = getShopify()
  const customerCreateMutation = `mutation CustomerSendAccountInviteEmail($customerId: ID!) {
  customerSendAccountInviteEmail(customerId: $customerId) {
    customer {
      id
    }
    userErrors {
      field
      message
    }
  }
}`

  return await client.request(customerCreateMutation, {
    variables: {
      customerId: id,
    },
  })
}
