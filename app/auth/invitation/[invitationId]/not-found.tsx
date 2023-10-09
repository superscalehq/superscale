'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { NotFoundLayout } from '@/components/layout/not-found';

export default function InvitationNotFound() {
  const router = useRouter();
  return (
    <NotFoundLayout>
      <Card className="flex flex-col items-center md:w-[450px]">
        <CardHeader>
          <CardTitle>Invitation not found</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 text-center">
          <p className="text-sm text-foreground">
            Please contact the person who invited you to get a new invitation.
          </p>
          <Button onClick={() => router.push('/')}>Back</Button>
        </CardContent>
      </Card>
    </NotFoundLayout>
  );
}
