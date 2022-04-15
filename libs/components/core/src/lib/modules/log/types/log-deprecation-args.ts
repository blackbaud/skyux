import { SkyLogLevel } from './log-level';

/**
 * @internal
 */
export interface SkyLogDepcrecationArgs {
  depcrecationVersion?: string;
  removalVersion?: string;
  replacementType?: string;
  logLevel?: SkyLogLevel;
  url?: string;
}
