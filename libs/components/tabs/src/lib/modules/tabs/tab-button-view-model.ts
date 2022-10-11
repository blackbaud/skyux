import { SkyTabIndex } from './tab-index';

/**
 * @internal
 */
export type TabButtonViewModel = {
  active: boolean;
  ariaControls: string;
  buttonHref: string;
  buttonId: string;
  buttonText: string;
  buttonTextCount: string;
  closeable: boolean;
  disabled: boolean;
  tabIndex: SkyTabIndex;
  tabNumber: number;
  totalTabsCount: number;
};
