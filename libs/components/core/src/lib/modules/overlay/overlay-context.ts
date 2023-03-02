import { SkyOverlayConfig } from './overlay-config';

/**
 * Contextual information for each overlay.
 * @internal
 */
export class SkyOverlayContext {
  constructor(public readonly config: SkyOverlayConfig) {}
}
