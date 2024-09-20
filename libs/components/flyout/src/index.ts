export { SkyFlyoutInstance } from './lib/modules/flyout/flyout-instance';
export { SkyFlyoutModule } from './lib/modules/flyout/flyout.module';
export {
  SkyFlyoutLegacyService,
  SkyFlyoutService,
} from './lib/modules/flyout/flyout.service';
export type { SkyFlyoutAction } from './lib/modules/flyout/types/flyout-action';
export { SkyFlyoutBeforeCloseHandler } from './lib/modules/flyout/types/flyout-before-close-handler';
export type { SkyFlyoutCloseArgs } from './lib/modules/flyout/types/flyout-close-args';
export type { SkyFlyoutConfig } from './lib/modules/flyout/types/flyout-config';
export type { SkyFlyoutMessage } from './lib/modules/flyout/types/flyout-message';
export { SkyFlyoutMessageType } from './lib/modules/flyout/types/flyout-message-type';
export type { SkyFlyoutPermalink } from './lib/modules/flyout/types/flyout-permalink';

// Components and directives must be exported to support Angular’s “partial” Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyFlyoutComponent as λ1 } from './lib/modules/flyout/flyout.component';
