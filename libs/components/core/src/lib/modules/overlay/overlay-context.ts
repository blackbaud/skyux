import { SkyOverlayConfig } from './overlay-config';

/**
 * Provides contextual information for each overlay.
 * @internal
 */
export class SkyOverlayContext {
  constructor(public readonly config: SkyOverlayConfig) {}
}
