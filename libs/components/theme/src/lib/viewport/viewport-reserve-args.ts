import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';

/**
 * @internal
 */
export interface SkyAppViewportReserveArgs {
  /**
   * A unique ID for the component reserving space.
   */
  id: string;

  /**
   * The position in the viewport where the space will be reserved.
   */
  position: SkyAppViewportReservedPositionType;

  /**
   * The number of pixels to reserve.
   */
  size: number;

  /**
   * Only reserve space when this element is in view.
   */
  reserveForElement?: HTMLElement;
}
