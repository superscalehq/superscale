import { prisma } from '@/lib/db';
import { shopify } from '@/lib/shopify';
import { redirect } from 'next/navigation';

// this handles the callback -- this is the point at which we get the access token back from shopify, and save it in the database.
export async function GET(req: Request) {
  const search = new URLSearchParams(req.url);
  console.log('received auth callback: ', search);
  const integration = await prisma.integration.findFirst({
    where: {
      externalId: search.get('shop')!,
    },
    include: {
      credentials: true,
      organization: true,
    },
  });
  if (!integration) {
    return new Response('Integration not found', {
      status: 404,
    });
  }
  const { session } = await shopify.auth.callback({ rawRequest: req });
  await prisma.integrationCredential.create({
    data: {
      integrationId: integration.id,
      credentialType: 'OAUTH_ACCESS_TOKEN',
      credentialValue: session.accessToken!,
      credentialMetadata: {
        scopes: session.scope,
      },
    },
  });

  const res = await shopify.webhooks.register({ session });

  return redirect(`/${integration.organization.slug}`);
}
