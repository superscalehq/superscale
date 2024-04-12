import '@shopify/shopify-api/adapters/web-api';

import {
  DeliveryMethod,
  LATEST_API_VERSION,
  shopifyApi,
} from '@shopify/shopify-api';
import { serverConfig } from './config';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-04';

export function shopifyApp() {
  const appUrl = new URL(serverConfig.SHOPIFY_APP_URL);
  const api = shopifyApi({
    apiKey: serverConfig.SHOPIFY_API_KEY,
    apiSecretKey: serverConfig.SHOPIFY_API_SECRET,
    apiVersion: LATEST_API_VERSION,
    hostName: appUrl.host,
    hostScheme: appUrl.protocol.replace(':', '') as 'http' | 'https',
    isEmbeddedApp: false,
    restResources,
    scopes: ['write_products'],
  });
  api.webhooks.addHandlers({
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/api/webhook/shopify',
    },
  });
  return api;
}

export const shopify = shopifyApp();
