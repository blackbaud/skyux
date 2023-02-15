import { HarnessPredicate } from '@angular/cdk/testing';
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

  /** Gets the icon name */
  public async getIconName(): Promise<string | undefined> {
    const iconClass = await (await this.#getIcon()).getProperty('classList');
    for (let i = 0; i < iconClass.length; i++) {
      if (/^sky-i-|fa-(?!fw|2xs|xs|sm|lg|2xl|[0-9]+x)/.test(iconClass[i])) {
        return iconClass[i]
          .replace(/-line|-solid$/, '')
          .replace(/^sky-i-|fa-/, '');
      }
    }
    return undefined;
  }

  /** Gets if the icon has fixed width */
  public async isFixedWidth(): Promise<boolean> {
    const icon = await this.#getIcon();
    return icon.hasClass(`fa-fw`);
  }

  /** Gets the icon type */
  public async getIconType(): Promise<string> {
    const iconClass = await (await this.#getIcon()).getProperty('classList');
    for (let i = 0; i < iconClass.length; i++) {
      if (/^sky-i-/.test(iconClass[i])) {
        return 'skyux';
      }
    }
    return 'fa';
  }

  /** Gets the icon size */
  public async getIconSize(): Promise<string | undefined> {
    const iconClass = await (await this.#getIcon()).getProperty('classList');
    for (let i = 0; i < iconClass.length; i++) {
      if (/^fa-(?=2xs|xs|sm|lg|2xl|[0-9]+x)/.test(iconClass[i])) {
        return iconClass[i].replace('fa-', '');
      }
    }
    return undefined;
  }

  /** Gets if the icon is a variant */
  public async getVariant(): Promise<string | undefined> {
    if ((await this.getIconType()) === 'skyux') {
      const iconClass = await (await this.#getIcon()).getProperty('classList');
      for (let i = 0; i < iconClass.length; i++) {
        if (/-line|-solid$/.test(iconClass[i])) {
          return iconClass[i].substring(iconClass[i].lastIndexOf('-') + 1);
        }
      }
      return undefined;
    }
    throw new Error(
      'Variant cannot be determined because iconType is not skyux'
    );
  }
}
