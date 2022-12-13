import { VerticalTabsDemoSubTab } from './vertical-tabs-demo-sub-tab';

export interface VerticalTabsDemoGroup {
  heading: string;
  isOpen: boolean;
  isDisabled: boolean;
  subTabs: VerticalTabsDemoSubTab[];
}
