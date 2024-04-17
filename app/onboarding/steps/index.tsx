'use client';

import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserWithMemberships } from '@/crud/user';
import { useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import NameStep from './name';
import OrganizationStep from './organization';
import ShopifyStep from './shopify';
import { redirect } from 'next/navigation';

interface FooterProps {
  loading: boolean;
}

interface OnboardingStepConfig {
  renderNext: boolean;
}

const onboardingConfig: Record<number, OnboardingStepConfig> = {
  0: {
    renderNext: true,
  },
  1: {
    renderNext: true,
  },
  2: {
    renderNext: false,
  },
};

function Footer({ loading }: FooterProps) {
  const { activeStep, previousStep, isFirstStep, isLastStep, stepCount } =
    useWizard();
  const progress = Math.ceil(((activeStep + 1) / stepCount) * 100);
  const stepConfig =
    onboardingConfig[activeStep as keyof typeof onboardingConfig];
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
        {!isLastStep && stepConfig.renderNext && (
          <Button type="submit" form={`onboarding-step-${activeStep + 1}`}>
            Next
          </Button>
        )}
        {isLastStep && stepConfig.renderNext && (
          <Button type="submit" form={`onboarding-step-${activeStep + 1}`}>
            Finish
          </Button>
        )}
      </div>
    </CardFooter>
  );
}

interface OnboardingProps {
  user: UserWithMemberships;
  shopifyAppStoreUrl: string;
}

function getOnboardingStep(user: UserWithMemberships) {
  if (!user.name) {
    return 0;
  }

  if (!user.memberships?.[0]?.organization.name) {
    return 1;
  }

  return 2;
}

export default function Onboarding(props: OnboardingProps) {
  const { user, shopifyAppStoreUrl } = props;

  if (
    user.memberships?.length > 0 &&
    user.memberships[0].organization.completedOnboarding
  ) {
    return redirect(`/${user.memberships[0].organization.slug}`);
  }

  const initialStep = getOnboardingStep(user);
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
        <ShopifyStep
          user={user}
          setLoading={setLoading}
          shopifyAppStoreUrl={shopifyAppStoreUrl}
        />
      </Wizard>
    </Card>
  );
}
