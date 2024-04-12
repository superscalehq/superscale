import { shopify } from '@/lib/shopify';

export function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const hmac = searchParams.get('hmac');
  const host = searchParams.get('host');
  const shop = searchParams.get('shop');
  const timestamp = searchParams.get('timestamp');
  console.log(`
  hmac: ${hmac}
  host: ${host}
  shop: ${shop}
  timestamp: ${timestamp}
  `);
  return shopify.auth.begin({
    shop: shop!,
    callbackPath: '/api/auth/shopify/callback',
    isOnline: false,
    rawRequest: req,
  });
}
