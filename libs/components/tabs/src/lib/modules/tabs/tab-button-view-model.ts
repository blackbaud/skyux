import { SkyTabIndex } from './tab-index';

/**
 * @internal
 */
export interface TabButtonViewModel {
  active: boolean;
  ariaControls: string;
  buttonHref: string | null;
  buttonId: string;
  buttonText: string | undefined;
  buttonTextCount: string | undefined;
  closeable: boolean;
  disabled: boolean | undefined;
  tabIndex: SkyTabIndex | undefined;
  tabNumber: number;
  totalTabsCount: number;
}
