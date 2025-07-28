'use server'
import { getShopify } from '@/lib/shopify-admin'

export async function shopifyCreateCustomer(
  is_main: boolean,
  email: string,
  contactPhone: string,
  firstName: string,
  lastName: string,
  tags: string,
  businessAddress1: string,
  businessCity: string,
  businessProvince: string,
  businessPhone: string,
  businessZip: string,
  company: string
) {
  const client = getShopify()
  const customerCreateMutation = `mutation createCustomerAndAddress($input: CustomerInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
      displayName
      addresses {
        id
        address1
        city
        province
        zip
        country
        phone
        company
      }
    }
    userErrors {
      field
      message
    }
  }
}`

  return await client.request(customerCreateMutation, {
    variables: {
      input: {
        email: email,
        phone: contactPhone,
        firstName: firstName,
        lastName: lastName,
        tags: `B2B, ${tags}, ${is_main ? 'primary-contact' : ''}`,
        addresses: [
          {
            address1: businessAddress1,
            city: businessCity,
            province: businessProvince,
            phone: businessPhone,
            zip: businessZip,
            country: 'US',
            company: company,
          },
        ],
      },
    },
  })
}
