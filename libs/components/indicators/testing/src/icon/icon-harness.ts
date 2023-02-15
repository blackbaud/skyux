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
    const iconClass = await (await this.#getIcon()).getAttribute('class');
    const regex = /^sky-i-|fa-(?!fw|2xs|xs|sm|lg|2xl|[0-9]+x)/;
    let className = iconClass
      ?.split(' ')
      .find((classValue: string) => classValue.match(regex));

    className = className?.replace(/-line|-solid$/, '');
    className = className?.replace(/^sky-i-|fa-/, '');
    return className;
  }

  /** Gets if the icon has fixed width */
  public async isFixedWidth(): Promise<boolean> {
    const icon = await this.#getIcon();
    return icon.hasClass(`fa-fw`);
  }

  /** Gets the icon type */
  public async getIconType(): Promise<string> {
    const iconClass = await (await this.#getIcon()).getAttribute('class');
    const classes = iconClass
      ?.split(' ')
      .find((classValue: string) => /^sky-i-/.test(classValue));
    if (classes) return 'skyux';
    return 'fa';
  }

  /** Gets the icon size */
  public async getIconSize(): Promise<string | undefined> {
    const iconClass = await (await this.#getIcon()).getAttribute('class');
    const size = iconClass
      ?.split(' ')
      .find((classValue: string) =>
        classValue.match(/^fa-(?=2xs|xs|sm|lg|2xl|[0-9]+x)/)
      );
    return size?.replace('fa-', '');
  }

  /** Gets if the icon is a variant */
  public async getVariant(): Promise<string | undefined> {
    const iconClass = await (await this.#getIcon()).getAttribute('class');
    if ((await this.getIconType()) === 'skyux') {
      const variant = iconClass
        ?.split(' ')
        .find((classValue: string) => /-line|-solid$/.test(classValue));
      return variant?.substring(variant.lastIndexOf('-') + 1);
    }
    throw new Error(
      'Variant cannot be determined because iconType is not skyux'
    );
  }
}
