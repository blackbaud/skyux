import {
  SkyProgressIndicatorItemComponent
} from '../progress-indicator-item';

export interface SkyProgressIndicatorChange {
  activeIndex?: number;
  items?: SkyProgressIndicatorItemComponent[];
  activeItem?: SkyProgressIndicatorItemComponent;
}
