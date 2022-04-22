import { SkyAffixer, SkyOverlayInstance } from '@skyux/core';

/**
 * Model for tracking the affixer and overlay of a row delete's inline delete.
 * @internal
 * @deprecated `SkyGridComponent` and its features are deprecated. We recommend using the data grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-grid
 */
export interface SkyGridRowDeleteContents {
  affixer: SkyAffixer;
  overlay: SkyOverlayInstance;
}
