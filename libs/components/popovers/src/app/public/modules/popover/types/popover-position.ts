import { SkyPopoverAlignment } from './popover-alignment';
import { SkyPopoverPlacement } from './popover-placement';

export interface SkyPopoverPosition {
  top?: number;
  left?: number;
  arrowTop?: number;
  arrowLeft?: number;
  placement: SkyPopoverPlacement;
  alignment?: SkyPopoverAlignment;
}
