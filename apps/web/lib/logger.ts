import pino from 'pino';
import pinoPretty from 'pino-pretty';
import { serverConfig } from './config';

export const logger = pino(
  {
    level: serverConfig.LOG_LEVEL,
  },
  serverConfig.NODE_ENV !== 'production' ? pinoPretty() : undefined
);
