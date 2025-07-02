import type { BusinessRecord, BusinessState } from "@/types/business-types"
import * as postmark from 'postmark'
import { formatDate } from "@/lib/utils"

// Create a client using the API key
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || "");

// Helper functions from view-business-modal.tsx
const formatArrayValue = (value: string[] | null): string => {
  if (!value || value.length === 0) return "None"
  return value.join(", ")
}

const getCategoryLabel = (category: string): string => {
  return category === "direct-retail" ? "Direct / Retail" : "Wholesale / Distributor"
}

const getSubcategoryLabel = (subcategory: string, category: string, otherSubcategory: string | null): string => {
  if (subcategory === "other" && otherSubcategory) {
    return otherSubcategory
  }

  if (category === "direct-retail") {
    const subcategories: Record<string, string> = {
      "bar-nightclub": "Bar / Nightclub",
      restaurant: "Restaurant",
      "liquor-store": "Liquor Store",
      "grocery-store": "Grocery Store",
      "event-coordinator": "Event Coordinator",
      "golf-course": "Golf Course",
      catering: "Catering",
    }
    return subcategories[subcategory] || subcategory
  } else {
    const subcategories: Record<string, string> = {
      beverage: "Beverage Distributor",
      foodservice: "Foodservice Distributor",
    }
    return subcategories[subcategory] || subcategory
  }
}

// Generate HTML for email that looks like the modal
export function generateBusinessRecordEmail(record: BusinessRecord): string {
  const mainManager = record.account_managers?.find(manager => manager.is_main);
  const additionalManagers = record.account_managers?.filter(manager => !manager.is_main) || [];
  
  // Basic CSS for email formatting with fixed-width fonts
  const styles = `
    body { font-family: 'Courier New', Courier, monospace; color: #333; line-height: 1.5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-family: 'Courier New', Courier, monospace; color: #333; font-size: 24px; margin-bottom: 20px; }
    h2 { font-family: 'Courier New', Courier, monospace; color: #9D783C; font-size: 18px; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
    h3 { font-family: 'Courier New', Courier, monospace; font-size: 16px; margin: 15px 0 5px; }
    .info-group { margin-bottom: 20px; }
    .info-row { margin-bottom: 10px; }
    .label { font-family: 'Courier New', Courier, monospace; font-weight: bold; color: #666; }
    .value { font-family: 'Courier New', Courier, monospace; }
    .card { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .tag { font-family: 'Courier New', Courier, monospace; background-color: #9D783C; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    table td { font-family: 'Courier New', Courier, monospace; padding: 8px; }
    .link { font-family: 'Courier New', Courier, monospace; color: #9D783C; }
  `;
  
  // HTML template
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Business Record Details</title>
      <style>${styles}</style>
    </head>
    <body>
      <div class="container">
        <h1>Business Record Details</h1>
        
        <!-- Basic Business Information -->
        <h2>Basic Business Information</h2>
        <div class="info-group">
          <div class="info-row">
            <div class="label">Business Name</div>
            <div class="value">${record.business_name}</div>
          </div>
          <div class="info-row">
            <div class="label">Business Phone</div>
            <div class="value">${record.business_phone}</div>
          </div>
          <div class="info-row">
            <div class="label">Business Address</div>
            <div class="value">${record.business_street_address}, ${record.business_city}, ${record.business_state} ${record.business_zip_code}</div>
          </div>
          <div class="info-row">
            <div class="label">Website URL</div>
            <div class="value">
              ${record.website_url ? 
                `<a href="${record.website_url}" class="link">${record.website_url}</a>` : 
                'Not provided'}
            </div>
          </div>
          <div class="info-row">
            <div class="label">EIN</div>
            <div class="value">${record.ein}</div>
          </div>
        </div>
        
        <!-- Business Category -->
        <h2>Business Category</h2>
        <div class="info-group">
          <div class="info-row">
            <div class="label">Retail Category</div>
            <div class="value">${getCategoryLabel(record.business_category)}</div>
          </div>
          <div class="info-row">
            <div class="label">
              ${record.business_category === "direct-retail" 
                ? "Direct / Retail Type" 
                : "Wholesale / Distributor Type"}
            </div>
            <div class="value">${getSubcategoryLabel(record.subcategory, record.business_category, record.other_subcategory)}</div>
          </div>
          <div class="info-row">
            <div class="label">Account Representative</div>
            <div class="value">${record.account_rep}</div>
          </div>
          <div class="info-row">
            <div class="label">Number of Locations</div>
            <div class="value">${record.location_count || "Not specified"}</div>
          </div>
        </div>
        
        <!-- Contact Information -->
        <h2>Contact Information</h2>
        

        
        <!-- Primary Representative -->
        <div class="card">
          <div class="card-header">
            <h3>Primary Representative</h3>
          </div>
          
          <table>
            <tr>
              <td class="label">Name</td>
              <td class="value">${mainManager.first_name} ${mainManager.last_name}</td>
            </tr>
            <tr>
              <td class="label">Email</td>
              <td class="value">
                ${mainManager.email ? 
                  `<a href="mailto:${mainManager.email}" class="link">${mainManager.email}</a>` : 
                  'Not specified'}
              </td>
            </tr>
            <tr>
              <td class="label">Phone</td>
              <td class="value">
                ${mainManager.phone ? 
                  `<a href="tel:${mainManager.phone}" class="link">${mainManager.phone}</a>` : 
                  'Not specified'}
              </td>
            </tr>
          </table>
        </div>
        
        ${additionalManagers.length > 0 ? `
        <!-- Additional Contacts -->
        <h3>Additional Contacts</h3>
        ${additionalManagers.map(manager => `
          <div class="card">
            <table>
              <tr>
                <td class="label">Name</td>
                <td class="value">${manager.first_name} ${manager.last_name}</td>
              </tr>
              <tr>
                <td class="label">Email</td>
                <td class="value">
                  ${manager.email ? 
                    `<a href="mailto:${manager.email}" class="link">${manager.email}</a>` : 
                    'Not specified'}
                </td>
              </tr>
              <tr>
                <td class="label">Phone</td>
                <td class="value">
                  ${manager.phone ? 
                    `<a href="tel:${manager.phone}" class="link">${manager.phone}</a>` : 
                    'Not specified'}
                </td>
              </tr>
            </table>
          </div>
        `).join('')}
        ` : ''}
        
        <!-- Additional Details -->
        <h2>Additional Details</h2>
        <div class="info-group">
          ${record.business_category === "wholesale-distributor" ? `
            <div class="info-row">
              <div class="label">Outlet Types</div>
              <div class="value">${formatArrayValue(record.outlet_types)}</div>
            </div>
            ${record.outlet_types?.includes("other") && record.other_outlet_description ? `
              <div class="info-row">
                <div class="label">Other Outlet Description</div>
                <div class="value">${record.other_outlet_description}</div>
              </div>
            ` : ''}
          ` : ''}
          
          ${record.business_category === "direct-retail" && record.why_sell_even ? `
            <div class="info-row">
              <div class="label">Why Sell EVEN</div>
              <div class="value">${record.why_sell_even.replace(/\\n/g, '<br>')}</div>
            </div>
          ` : ''}
        </div>
        
        <!-- States -->
        <h2>States</h2>
        
        ${record.states && record.states.length > 0 ? `
          <div class="info-group">
            ${record.states.map(state => `
              <div class="card">
                <div class="card-header">
                  <h3>${state.state_name}</h3>
                  <span>${state.state_code}</span>
                </div>
                <table>
                  <tr>
                    <td class="label">Reseller Number</td>
                    <td class="value">${state.reseller_number}</td>
                  </tr>
                  <tr>
                    <td class="label">Documentation</td>
                    <td class="value">
                      ${state.document_url ? 
                        `<a href="https://qycfyruqxhypaaehyuvv.supabase.co/storage/v1/object/public/business-documents/${state.document_url}" class="link">View Document</a>` : 
                        'No document provided'}
                    </td>
                  </tr>
                </table>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="info-row">
            <p>No states added</p>
          </div>
        `}
        
        <!-- Metadata -->
        <h2>Metadata</h2>
        <div class="info-group">
          <div class="info-row">
            <div class="label">Submission Date</div>
            <div class="value">${formatDate(record.created_at)}</div>
          </div>
          <div class="info-row">
            <div class="label">Last Updated</div>
            <div class="value">${formatDate(record.updated_at)}</div>
          </div>
          <div class="info-row">
            <div class="label">Record ID</div>
            <div class="value"><code style="font-family: monospace; font-size: 12px;">${record.id}</code></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Function to send business record email
export async function sendBusinessRecordEmail(
  record: BusinessRecord,
  toEmail: string,
  fromEmail: string = "accounts@drinkeven.co"
): Promise<boolean> {
  try {
    const htmlContent = generateBusinessRecordEmail(record);
    
    const response = await client.sendEmail({
      From: fromEmail,
      To: toEmail,
      Subject: `Business Record: ${record.business_name}`,
      HtmlBody: htmlContent,
      TextBody: `Business record details for ${record.business_name}. View in an HTML email client for formatting.`,
      MessageStream: "outbound"
    });
    
    console.log("Email sent successfully:", response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
