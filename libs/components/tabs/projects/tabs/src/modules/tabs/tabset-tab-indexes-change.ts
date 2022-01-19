import { SkyTabIndex } from './tab-index';

export interface SkyTabsetTabIndexesChange {
  tabs?: {
    tabHeading: string;

    tabIndex: SkyTabIndex;
  }[];
}
