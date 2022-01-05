import { createContext } from 'react';

import { Config } from './types';

export const CanvasBarConfigContext = createContext<Partial<Config> | undefined>(undefined);
