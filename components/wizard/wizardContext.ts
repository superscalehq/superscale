import * as React from 'react';

import { WizardValues } from './types';

const WizardContext = React.createContext<WizardValues | null>(null);

if (process.env.NODE_ENV !== 'production') {
  WizardContext.displayName = 'WizardContext';
}

export default WizardContext;
