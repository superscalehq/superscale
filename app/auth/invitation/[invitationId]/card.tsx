'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvitationWithOrgAndInviter } from '@/crud/invitation';
import { useRouter } from 'next/navigation';

interface Props {
  invitation: InvitationWithOrgAndInviter;
}

export function InvitationCard({ invitation }: Props) {
  const router = useRouter();
  const handleClick = () => {
    router.push(
      invitation
        ? `/auth/sign-in?email=${invitation.email}&invitationId=${invitation.id}`
        : '/'
    );
  };
  return (
    <Card className="flex flex-col items-center md:w-[450px]">
      <CardHeader>
        <CardTitle>
          {invitation
            ? `${invitation.createdBy.name} has invited you to ${invitation.organization.name}`
            : 'Invitation not found'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 text-center">
        <p className="text-sm text-foreground">
          {invitation
            ? `To accept the invitation, please sign in or create an account with ${invitation.email}`
            : 'Please contact the person who invited you to get a new invitation.'}
        </p>
        <Button onClick={handleClick}>
          {invitation ? 'Accept Invitation' : 'Back'}
        </Button>
      </CardContent>
    </Card>
  );
}
