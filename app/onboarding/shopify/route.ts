import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { shopify } from '@/lib/shopify';
import { IntegrationProvider, IntegrationType } from '@prisma/client';
import { InvalidHmacError } from '@shopify/shopify-api';
import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams);
    logger.info({ searchParams });
    const validHmac = await shopify.utils.validateHmac(searchParams);
    if (!validHmac) {
      return new Response('Invalid HMAC', { status: 400 });
    }

    // create an integration
    const user = await getCurrentUser();
    if (!user?.memberships.length) {
      logger.error(
        'Failed to create integration: user is not a member of any organization',
        { user }
      );
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

    return shopify.auth.begin({
      shop: searchParams.shop!,
      callbackPath: '/api/auth/shopify/callback',
      isOnline: false,
      rawRequest: req,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof InvalidHmacError) {
      return new Response('Invalid HMAC', { status: 400 });
    }

    return new Response('Internal server error', { status: 500 });
  }
}
