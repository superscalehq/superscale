import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { shopify } from '@/lib/shopify';
import { IntegrationProvider, IntegrationType } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  // const searchParams = new URL(req.url).searchParams;
  // const hmac = searchParams.get('hmac');
  // const host = searchParams.get('host');
  // const shop = searchParams.get('shop');
  // const timestamp = searchParams.get('timestamp');
  // console.log(`
  // hmac: ${hmac}
  // host: ${host}
  // shop: ${shop}
  // timestamp: ${timestamp}
  // `);
  // const { searchParams } = new URL(req.url);
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams);
  console.log('searchParams', searchParams);
  const validHmac = await shopify.utils.validateHmac(searchParams);
  if (!validHmac) {
    return new Response('Invalid HMAC', { status: 400 });
  }

  // create an integration
  const user = await getCurrentUser();
  console.log('user', user);
  if (!user?.memberships.length) {
    return new Response('User is not a member of any organization', {
      status: 400,
    });
  }

  const organizationId = user.memberships[0].organizationId;
  const integration = await prisma.integration.upsert({
    where: {
      externalId_integrationProvider: {
        externalId: searchParams.shop!,
        integrationProvider: IntegrationProvider.SHOPIFY,
      },
    },
    create: {
      externalId: searchParams.shop!,
      integrationProvider: IntegrationProvider.SHOPIFY,
      integrationType: IntegrationType.OAUTH,
      organizationId,
      metadata: {
        shop: searchParams.shop!,
      },
    },
    update: {},
    include: {
      credentials: true,
    },
  });

  if (integration.credentials.length) {
    return redirect(`/${user.memberships[0].organization.slug}`);
  }
  // await prisma.integration.create({
  //   data: {
  //     externalId: searchParams.shop!,
  //     integrationProvider: IntegrationProvider.SHOPIFY,
  //     integrationType: IntegrationType.OAUTH,
  //     organizationId,
  //     metadata: {
  //       shop: searchParams.shop!,
  //     },
  //   },
  // });

  return shopify.auth.begin({
    shop: searchParams.shop!,
    callbackPath: '/api/auth/shopify/callback',
    isOnline: false,
    rawRequest: req,
  });
}
