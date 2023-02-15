import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';

/**
 * Reserved space for the top, right, bottom, and left sides of the viewport.
 */
export type SkyAppViewportReservedSpace = {
  [key in SkyAppViewportReservedPositionType]: number;
};
