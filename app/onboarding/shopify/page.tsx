interface Props {
  searchParams: { [key: string]: string };
}
export default function ShopifyOnboardingPage({ searchParams }: Props) {
  const hmac = searchParams.hmac;
  const host = searchParams.host;
  const shop = searchParams.shop;
  const timestamp = searchParams.timestamp;
  return (
    <div>
      Hello! These are the search params:
      <ul>
        <li>hmac: {hmac}</li>
        <li>host: {host}</li>
        <li>shop: {shop}</li>
        <li>timestamp: {timestamp}</li>
      </ul>
    </div>
  );
}
