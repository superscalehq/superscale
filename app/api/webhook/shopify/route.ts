export async function POST(req: Request) {
  const data = await req.json();
  console.log('processing webhook: ', data);
  return Response.json({ message: 'ok' });
}
