import { prisma } from '@/lib/db';
import { shopify } from '@/lib/shopify';
import { IntegrationProvider } from '@prisma/client';
import { WebhookValidationErrorReason } from '@shopify/shopify-api';

export async function POST(req: Request) {
  // const data = await req.json();
  // console.log('processing webhook: ', data);
  const body = await req.text();
  console.log(
    'processing webhook: ',
    JSON.stringify(JSON.parse(body), null, 2)
  );
  const res = await shopify.webhooks.validate({
    rawBody: body,
    rawRequest: req,
  });

  if (!res.valid) {
    if (res.reason === WebhookValidationErrorReason.InvalidHmac) {
      console.error('Webhook HMAC validation failed', res);
      return new Response(undefined, {
        status: 401,
        statusText: 'Unauthorized',
      });
    } else {
      console.error('Webhook validation failed', res);
      return new Response(undefined, {
        status: 400,
        statusText: 'Bad Request',
      });
    }
  }
  // delete the integration
  await prisma.integration.delete({
    where: {
      externalId_integrationProvider: {
        externalId: res.domain,
        integrationProvider: IntegrationProvider.SHOPIFY,
      },
    },
  });

  console.log('deleted integration');

  return new Response(undefined, {
    status: 200,
    statusText: 'OK',
  });
}
