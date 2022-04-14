import { SkyLogLevel } from './log-level';

/**
 * @internal
 */
export interface SkyLogDepcrecationArgs {
  replacementTypes?: string | string[];
  logLevel?: SkyLogLevel;
}
