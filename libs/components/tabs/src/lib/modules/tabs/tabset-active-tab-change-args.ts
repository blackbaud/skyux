import { SkyTabIndex } from './tab-index';

export interface SkyTabsetActiveTabChangeArgs {
  tabIndex: SkyTabIndex | undefined;
  initial?: boolean;
}
