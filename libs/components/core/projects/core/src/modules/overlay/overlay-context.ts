import { SkyOverlayConfig } from './overlay-config';

/**
 * Provides contextual information to each overlay created.
 * @internal
 */
export class SkyOverlayContext {
  constructor(public readonly config: SkyOverlayConfig) {}
}
