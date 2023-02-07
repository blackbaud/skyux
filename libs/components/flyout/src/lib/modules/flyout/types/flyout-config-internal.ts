import { SkyFlyoutConfig } from './flyout-config';

/**
 * Type to represent the flyout configuration after default values have been applied.
 * @internal
 */
export interface SkyFlyoutConfigInternal extends SkyFlyoutConfig {
  /**
   * The default width of the flyout container. If you do not provide a width,
   * the flyout defaults to half the width of its container.
   */
  defaultWidth: number;

  /**
   * The minimum resize width of the flyout container.
   * @default 320
   */
  minWidth: number;

  /**
   * The maximum resize width of the flyout container.
   * @default defaultWidth
   */
  maxWidth: number;

  /**
   * The array of custom providers to pass to the component's constructor.
   */
  providers: any[];
}
