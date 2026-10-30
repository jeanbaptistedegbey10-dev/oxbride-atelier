/**
 * OXBride Atelier — Client Shopify Storefront API
 * Endpoint GraphQL du shop : https://<domaine>.myshopify.com/api/2024-10/graphql.json
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = '2024-10';

export function getStorefrontApiUrl(): string {
  if (!STORE_DOMAIN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN est manquant dans les variables d\'environnement.');
  }
  return `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
}

export interface ShopifyFetchOptions {
  /** Force le contournement du cache Next.js (revalidation à chaque requête) */
  cache?: RequestCache;
}

export async function shopifyFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options: ShopifyFetchOptions = {}
): Promise<T> {
  if (!STOREFRONT_ACCESS_TOKEN) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN est manquant dans les variables d\'environnement.');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[ShopifyFetch] Requête Storefront API :', {
      url: getStorefrontApiUrl(),
      variables,
      cache: options.cache ?? 'no-store',
      // Le token n'est jamais logué pour des raisons de sécurité.
      hasToken: Boolean(STOREFRONT_ACCESS_TOKEN),
    });
  }

  const response = await fetch(getStorefrontApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: options.cache ?? 'no-store',
    // Next.js revalidation tag optionnel pour le cache on-demand (ISR)
    next: { tags: ['shopify-metaobject'] },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[ShopifyFetch] Réponse HTTP :', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Shopify Storefront API (${response.status}): ${body}`);
  }

  const json = await response.json();

  if (json.errors) {
    const details = json.errors.map((err: { message: string; extensions?: Record<string, unknown> }) => ({
      message: err.message,
      code: err.extensions?.code,
      type: err.extensions?.type,
    }));
    if (process.env.NODE_ENV === 'development') {
      console.error('[ShopifyFetch] Erreurs GraphQL détaillées :', details);
    }
    const messages = json.errors.map((err: { message: string }) => err.message).join(', ');
    throw new Error(`Shopify GraphQL errors: ${messages}`);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[ShopifyFetch] Données reçues :', JSON.stringify(json.data, null, 2).slice(0, 2000));
  }

  return json.data as T;
}
