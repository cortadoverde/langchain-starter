import { supabase } from '@/lib/supabase';
import { get } from 'http';
let lastToken: any = {
    access_token: '1000.dadafdea3b45705ca98410ad69872702.04dca1fa06fe5960692b3875cfa9bb72',
    scope: 'ZohoInventory.FullAccess.all',
    api_domain: 'https://www.zohoapis.com',
    token_type: 'Bearer',
    expires_in: 3600
  };
class ZohoInventoryService {
  private accessToken: string;

  private _refreshToken: string;

  private _clientId: string;

  private _clientSecret: string;

  private _redirectURI: string;

  private _organizationId: string;

  constructor() {
    this.accessToken = '';
    this._refreshToken = process.env.ZOHO_REFRESH_TOKEN || '';
    this._clientId = process.env.ZOHO_CLIENT_ID || '';
    this._clientSecret = process.env.ZOHO_CLIENT_SECRET || '';
    this._redirectURI = process.env.ZOHO_REDIRECT_URI || '' ;
    this._organizationId = process.env.ZOHO_ORGANIZATION_ID || '';
  }

  private async setHeader() {
    this.accessToken = await this.getValidToken();
  }

  private async storeToken(accessToken: string, expiresIn: number) {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    // Store the token and expiration time in a database or a file
    // utilizar supabase para almacenar
    lastToken = { accessToken, expiresAt };

  }

  private async getValidToken(): Promise<string> {
    // Retrieve the token from the database or a file
    const token = lastToken; // Replace with actual retrieval logic

    if (token ) {
      return token.access_token;
    }
    const newToken = await this.refreshToken();
    
    await this.storeToken(newToken.access_token, newToken.expires_in);

    return newToken.access_token;
  }

  private async refreshToken() {
    const uri = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${this._refreshToken}&client_id=${this._clientId}&client_secret=${this._clientSecret}&redirect_uri=${this._redirectURI}&grant_type=refresh_token`;
    const response = await fetch(uri, {
      method: 'POST',
    });
    return response.json();
  }

  private normalizeResult(apiData: any) {
    return apiData.map((item: any) => ({
      id: item.item_id,
      title: item.name,
      description: item.name,
      stock: item.actual_available_stock,
      price: item.rate,
      sku: item.sku,
    }));
  }

  public async syncCustomerToZoho(customer: any) {
    await this.setHeader();

    if (customer.zoho_customer_id) return;
    let customerId = await this.getZohoCustomerId(customer.email);

    if (!customerId) {
      customerId = await this.createZohoCustomer(customer);
    }

    customer.zoho_customer_id = customerId;
    // Save the customer with the new Zoho customer ID
  }

  private async getZohoCustomerId(email: string) {
    await this.setHeader();

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/contacts?email=${email}&organization_id=${this._organizationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const contacts = data.contacts;

    if (contacts.length > 0) {
      return contacts[0].contact_id;
    }

    return null;
  }

  private async createZohoCustomer(customer: any) {
    await this.setHeader();

    const zohoCustomer = {
      contact_name: `${customer.first_name} ${customer.last_name}`,
      contact_persons: [
        {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email,
        },
      ],
      custom_fields: [
        {
          local_customer_id: customer.id,
        },
      ],
    };

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/contacts?organization_id=${this._organizationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zohoCustomer),
    });

    const data = await response.json();
    return data.contact.contact_id;
  }

  public async getProducts( { initPage = 1, limit = 10 } = {} ) {
    
    await this.setHeader();
    let page = initPage;
    let hasMorePage = true;
    const products = [];
    while (hasMorePage) {
      const response = await fetch(`https://www.zohoapis.com/inventory/v1/itemgroups?page=${page}&organization_id=${this._organizationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      products.push(data);
      hasMorePage = false; //data.page_context.has_more_page;
      page++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
    }

    return products;
  }

  public async getItemsByGroup(groupId: string) {
    await this.setHeader();

    let page = 1;
    let hasMorePage = true;
    const items = [];

    while (hasMorePage) {
      const response = await fetch(`https://www.zohoapis.com/inventory/v1/itemgroups/${groupId}?page=${page}&organization_id=${this._organizationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      items.push(...data.item_group.items);
      hasMorePage = data.page_context.has_more_page;
      page++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
    }

    return items.map((item: any) => ({
      ...item,
      id: item.item_id,
      title: item.name ?? '',
      description: item.name ?? '',
      stock: item.actual_available_stock ?? 0,
      price: item.rate ?? 0,
      sku: item.sku ?? '',
    }));
  }

  public async createOrder(order: any) {
    await this.setHeader();

    if (!order.customer.zoho_customer_id) {
      await this.syncCustomerToZoho(order.customer);
    }

    const zohoOrder = {
      customer_id: order.customer.zoho_customer_id,
      line_items: order.orderItems.map((item: any) => ({
        item_id: item.product.zoho_id,
        name: item.product.title,
        quantity: item.quantity,
        rate: item.product.price,
        product_id: item.product.group_id,
      })),
    };

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders?organization_id=${this._organizationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zohoOrder),
    });

    return response.json();
  }

  public async getSalesOrderById(id: string) {
    await this.setHeader();

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders/${id}?organization_id=${this._organizationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  public async getItemById(id: string) {
    await this.setHeader();

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/items/${id}?organization_id=${this._organizationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  public async confirmOrder(zohoId: string) {
    await this.setHeader();

    const response = await fetch(`https://www.zohoapis.com/inventory/v1/salesorders/${zohoId}/status/confirmed?organization_id=${this._organizationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }
}

export const client = new ZohoInventoryService();

export default {
  ZohoInventoryService: ZohoInventoryService,
  client: client,
  getProducts: (options: any) => client.getProducts(options)
}