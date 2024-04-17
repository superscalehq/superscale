import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/util/icons';
import { UserWithMemberships } from '@/crud/user';
import Link from 'next/link';

interface Props {
  user: UserWithMemberships;
  shopifyAppStoreUrl: string;
  setLoading: (loading: boolean) => void;
}

export default function ShopifyStep({ shopifyAppStoreUrl }: Props) {
  return (
    <>
      <CardHeader>
        <CardTitle>Connect Shopify Store</CardTitle>
        <CardDescription>
          This step will take you to the Shopify App Store, where you can
          install the Superscale Shopify App for your store. Once installed, you
          will be redirected back to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" asChild>
          <Link href={shopifyAppStoreUrl}>
            Install Shopify App
            <Icons.arrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </>
  );
}
