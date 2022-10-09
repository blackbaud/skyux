import { SkyFlyoutConfig } from './flyout-config';

/**
 * Type to represent the flyout configuration after default values have been applied.
 * @internal
 */
export interface SkyFlyoutConfigInternal extends SkyFlyoutConfig {
  /**
   * Specifies the default width of the flyout container. If you do not provide a width,
   * the flyout defaults to half the width of its container.
   */
  defaultWidth: number;

  /**
   * Specifies the minimum resize width of the flyout container.
   * @default 320
   */
  minWidth: number;

  /**
   * Specifies the maximum resize width of the flyout container.
   * @default defaultWidth
   */
  maxWidth: number;

  /**
   * Specifies an array of custom providers to pass to the component's constructor.
   */
  providers: any[];
}
