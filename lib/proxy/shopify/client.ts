const baseUrl = `${process.env.SHOPIFY_URL}/admin/api/2024-04/`;
const headers = {
  'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
  'Content-Type': 'application/json'
};

export const createProduct = async (productData: any) => {
  const response = await fetch(`${baseUrl}products.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ product: productData })
  });
  return response.json();
};

export const createProductVariant = async (productId: string, productData: any) => {
  const response = await fetch(`${baseUrl}products/${productId}/variants.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ variant: productData })
  });
  return response.json();
};

export const getAllProducts = async () => {
    const response = await fetch(`${baseUrl}products.json`, {
        method: 'GET',
        headers
        });
    try {

        return await response.json();
    } catch (error) {
        return { error }
    }
    /*
    const response = await fetch(`${baseUrl}products.json`, {
    method: 'GET',
    headers
  });
  const data = await response.json();
  return data.products;
  */
};

export const deleteProduct = async (productId: string) => {
  await fetch(`${baseUrl}products/${productId}.json`, {
    method: 'DELETE',
    headers
  });
};

export const getProductByTitle = async (title: string) => {
  const response = await fetch(`${baseUrl}products.json?title=${title}`, {
    method: 'GET',
    headers
  });
  const data = await response.json();
  const products = data.products;
  return products.length > 0 ? products[0] : null;
};

export const updateProduct = async (productId: string, productData: any) => {
  const response = await fetch(`${baseUrl}products/${productId}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ product: productData })
  });
  return response.json();
};

export const updateProductVariant = async (productData: any) => {
  const response = await fetch(`${baseUrl}variants/${productData.id}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ variant: productData })
  });
  return response.json();
};

export const getOrders = async () => {
  const response = await fetch(`${baseUrl}orders.json?status=any`, {
    method: 'GET',
    headers
  });
  return response.json();
};

export const getOrder = async (orderId: string) => {
  const response = await fetch(`${baseUrl}orders/${orderId}.json`, {
    method: 'GET',
    headers
  });
  return response.json();
};

export const syncOrders = async () => {
  const response = await fetch(`${baseUrl}orders.json?status=any`, {
    method: 'GET',
    headers
  });
  return response.json();
};

export const getCustomers = async () => {
  const response = await fetch(`${baseUrl}customers.json`, {
    method: 'GET',
    headers
  });
  return response.json();
};

export const createWebhook = async () => {
  const webhookData = {
    webhook: {
      topic: 'order_transactions/create',
      address: '/shopify/orders/transaction/webhook',
      format: 'json'
    }
  };
  const response = await fetch(`${baseUrl}webhooks.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify(webhookData)
  });
  return response.json();
};

export const getProductVariants = async (productId: string) => {
  const response = await fetch(`${baseUrl}products/${productId}/variants.json`, {
    method: 'GET',
    headers
  });
  const data = await response.json();
  return data.variants;
};

export const getProductVariant = async (variantId: string) => {
  const response = await fetch(`${baseUrl}variants/${variantId}.json`, {
    method: 'GET',
    headers
  });
  const data = await response.json();
  return data.variant;
};

export const updateInventory = async (variant: any, product: any) => {
  const data = {
    inventory_item_id: variant.inventory_item_id,
    location_id: await getLocation(),
    available: product.stock
  };
  const response = await fetch(`${baseUrl}inventory_levels/set.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return response.json();
};

const getLocation = async () => {
  const response = await fetch(`${baseUrl}locations.json?active=true`, {
    method: 'GET',
    headers
  });
  const data = await response.json();
  const locations = data.locations;
  const location = locations.find((item: any) => item.name === process.env.NEXT_PUBLIC_SHOPIFY_LOCATION) || locations[0];
  return location.id;
};

export const deleteVariant = async (product: any) => {
  await fetch(`${baseUrl}products/${product.group.shopify_id}/variants/${product.shopify_id}.json`, {
    method: 'DELETE',
    headers
  });
};