import { shopify } from '@/lib/shopify';

// this handles the callback -- this is the point at which we get the access token back from shopify, and save it in the database.
export async function GET(req: Request) {
  const search = new URLSearchParams(req.url);
  console.log('received auth callback: ', search);
  const { session } = await shopify.auth.callback({ rawRequest: req });
  console.log('got session: ', session);
  const res = await shopify.webhooks.register({ session });
  console.log('registered webhooks: ', res);
  return Response.json({ message: 'ok ' });
}
