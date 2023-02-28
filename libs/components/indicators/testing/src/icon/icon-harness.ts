import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyIconHarnessFilters } from './icon-harness-filters';

// match ending in `-line` or `-solid`
const ICON_CLASS_VARIANT_REGEXP = /(-line|-solid)$/;

/**
 * Harness for interacting with an icon component in tests.
 */
export class SkyIconHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-icon';

  #getIcon = this.locatorFor('.sky-icon');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyIconHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyIconHarnessFilters
  ): HarnessPredicate<SkyIconHarness> {
    return SkyIconHarness.getDataSkyIdPredicate(filters);
  }

  async #getIconClasses(): Promise<string[]> {
    const iconClasses = await (await this.#getIcon()).getProperty('classList');
    return Array.from(iconClasses);
  }

  /** Gets the icon name */
  public async getIconName(): Promise<string | undefined> {
    const iconClasses = await (await this.#getIcon()).getProperty('classList');
    for (const iconClass of iconClasses) {
      // match a class name that starts with `sky-i` or starts with `fa-` but does not follow with `fw` (fixed width) or lg, 2x, 3x, 4x, 5x
      if (/^sky-i-|^fa-(?!fw|lg|[2-5]+x)/.test(iconClass)) {
        return (
          iconClass
            .replace(ICON_CLASS_VARIANT_REGEXP, '')
            // remove `sky-i` or `fa-` from the beginning of the icon class name
            .replace(/^(sky-i-|fa-)/, '')
        );
      }
    }
    throw new Error('Icon requires iconName'); // TODO: how to handle harness for required values!?
  }

  /** Gets the icon size */
  public async getIconSize(): Promise<string | undefined> {
    const iconClasses = await this.#getIconClasses();
    for (const iconClass of iconClasses) {
      // match a class name that starts with `fa-` and  follows with lg, 2x, 3x, 4x, 5x
      if (/^fa-(?=2xs|lg|[2-5]+x)/.test(iconClass)) {
        return iconClass.replace('fa-', '');
      }
    }
    return undefined;
  }

  /** Gets the icon type */
  public async getIconType(): Promise<string> {
    const iconClasses = await this.#getIconClasses();
    for (const iconClass of iconClasses) {
      // match a class name that starts with `sky-i`
      if (/^sky-i-/.test(iconClass)) {
        return 'skyux';
      }
    }
    return 'fa';
  }

  /** Gets if the icon is a variant */
  public async getVariant(): Promise<string | undefined> {
    if ((await this.getIconType()) === 'skyux') {
      const iconClasses = await this.#getIconClasses();
      for (const iconClass of iconClasses) {
        if (ICON_CLASS_VARIANT_REGEXP.test(iconClass)) {
          return iconClass.substring(iconClass.lastIndexOf('-') + 1);
        }
      }
      return undefined; // TODO different icons have different default variant returns
    }
    throw new Error(
      'Variant cannot be determined because iconType is not skyux'
    );
  }

  /** Gets if the icon has fixed width */
  public async isFixedWidth(): Promise<boolean> {
    const icon = await this.#getIcon();
    return icon.hasClass(`fa-fw`);
  }
}
