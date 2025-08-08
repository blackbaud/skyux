import { HarnessPredicate, TestElement } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyIconHarnessFilters } from './icon-harness-filters';

/**
 * Harness for interacting with an icon component in tests.
 */
export class SkyIconHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-icon';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyIconHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyIconHarnessFilters,
  ): HarnessPredicate<SkyIconHarness> {
    return SkyIconHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the icon name.
   */
  public async getIconName(): Promise<string | undefined> {
    // No need to check for null here since #getIcon() will throw an error when
    // icon name is null.
    return (await this.#getSpecifiedIconInfo()).icon as string;
  }

  /**
   * Gets the icon size.
   */
  public async getIconSize(): Promise<string | undefined> {
    const iconClasses = await this.#getIconClasses();

    for (const iconClass of iconClasses) {
      // match a class name that starts with `sky-icon-svg-` and follows with icon sizes
      if (/^sky-icon-svg-(?=xxxs|xxs|xs|s|m|l|xl|xxl|xxxl)/.test(iconClass)) {
        return iconClass.replace('sky-icon-svg-', '');
      }
    }
    return undefined;
  }

  /**
   * Gets if the icon is a variant.
   */
  public async getVariant(): Promise<string | undefined> {
    const iconInfo = await this.#getSpecifiedIconInfo();
    return iconInfo.variant || 'line';
  }

  async #getIcon(): Promise<TestElement> {
    const svgIcon = await this.locatorForOptional('sky-icon-svg')();

    if (svgIcon) {
      return svgIcon;
    }

    throw new Error('Icon could not be rendered.');
  }

  async #getIconClasses(): Promise<string[]> {
    const iconClasses = await (await this.#getIcon()).getProperty('classList');
    return Array.from(iconClasses);
  }

  async #getSpecifiedIconInfo(): Promise<{
    icon: string | null;
    variant: string | null;
  }> {
    // Since SKY UX icons have Font Awesome alternatives that may be used
    // in default theme instead of the icon specified by the consumer, we
    // need to get the specified values using data- attributes added by
    // the icon component. This conflicts with the usual pattern of giving
    // the effective state of the component but is necessary in this case.
    const icon = await this.#getIcon();

    return {
      icon: await icon.getAttribute('data-sky-icon'),
      variant: await icon.getAttribute('data-sky-icon-variant'),
    };
  }
}
