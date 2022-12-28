import { SkyOverlayConfig } from './overlay-config';

/**
 * Contextual information to each overlay created.
 * @internal
 */
export class SkyOverlayContext {
  constructor(public readonly config: SkyOverlayConfig) {}
}
