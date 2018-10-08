import {
  SkyFlyoutPermalink
} from './flyout-permalink';
import {
  SkyFlyoutAction
} from './flyout-action';

export interface SkyFlyoutConfig {
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
  ariaRole?: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  permalink?: SkyFlyoutPermalink;
  primaryAction?: SkyFlyoutAction;
  providers?: any[];
}
