import * as React from 'react';

import { WizardValues } from './types';
import WizardContext from './wizardContext';

const useWizard = () => {
  const context = React.useContext(WizardContext);

  if (!context && process.env.NODE_ENV !== 'production') {
    throw Error('Wrap your step with `Wizard`');
  } else {
    return context as WizardValues;
  }
};

export default useWizard;
