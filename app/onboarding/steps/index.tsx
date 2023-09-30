'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserWithMemberships } from '@/crud/user';
import { useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import NameStep from './name';
import OrganizationStep from './organization';

interface FooterProps {
  loading: boolean;
}

function Footer({ loading }: FooterProps) {
  const { activeStep, previousStep, isFirstStep, isLastStep, stepCount } =
    useWizard();
  const progress = Math.ceil(((activeStep + 1) / stepCount) * 100);
  return (
    <CardFooter className="flex flex-row justify-between space-x-2">
      <div className="flex w-28 flex-col space-y-2">
        <span className="text-sm text-gray-500">
          Step {activeStep + 1} / {stepCount}
        </span>
        <Progress value={progress} />
      </div>
      <div className="flex flex-row space-x-4">
        {!isFirstStep && (
          <Button variant="outline" onClick={previousStep}>
            Previous
          </Button>
        )}
        {!isLastStep && (
          <Button
            type="submit"
            loading={loading}
            form={`onboarding-step-${activeStep + 1}`}
          >
            Next
          </Button>
        )}
        {isLastStep && (
          <Button
            type="submit"
            loading={loading}
            form={`onboarding-step-${activeStep + 1}`}
          >
            Finish
          </Button>
        )}
      </div>
    </CardFooter>
  );
}

interface OnboardingProps {
  user: UserWithMemberships;
}

export default function Onboarding(props: OnboardingProps) {
  const { user } = props;
  const initialStep = user.name ? 1 : 0;
  const [loading, setLoading] = useState(false);
  return (
    <Card className="flex flex-col px-8 py-6 md:h-[500px] md:w-[600px]">
      <Wizard
        startIndex={initialStep}
        wrapper={<div className="flex flex-1 flex-col justify-center" />}
        footer={<Footer loading={loading} />}
      >
        <NameStep user={user} setLoading={setLoading} />
        <OrganizationStep user={user} setLoading={setLoading} />
      </Wizard>
    </Card>
  );
}
