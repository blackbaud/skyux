import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySectionedFormHarnessFilters } from './sectioned-form-harness-filters';
import { SkySectionedFormSectionContentHarness } from './sectioned-form-section-content-harness';
import { SkySectionedFormSectionHarness } from './sectioned-form-section-harness';
import { SkySectionedFormSectionHarnessFilters } from './sectioned-form-section-harness-filters';

/**
 * Harness for interacting with a sectioned form component in tests.
 */
export class SkySectionedFormHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-sectioned-form';

  #getTabs = this.locatorForOptional('div.sky-sectioned-form-tabs');
  #getContent = this.locatorForOptional('div.sky-sectioned-form-content');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySectionedFormHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySectionedFormHarnessFilters,
  ): HarnessPredicate<SkySectionedFormHarness> {
    return SkySectionedFormHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the `SkySectionedFormSectionHarness` for the currently active section.
   */
  public async getActiveSection(): Promise<
    SkySectionedFormSectionHarness | undefined
  > {
    const sections = await this.getSections();

    if (sections) {
      for (const section of sections) {
        if (await section.isActive()) {
          return section;
        }
      }
    }

    return undefined;
  }

  public async getActiveSectionContent(): Promise<
    SkySectionedFormSectionContentHarness | undefined
  > {
    if (await this.#getContent()) {
      const contents = await this.locatorForAll(
        SkySectionedFormSectionContentHarness,
      )();
      for (const content of contents) {
        if (await content.isVisible()) {
          return content;
        }
      }
      return undefined;
    }

    throw new Error('Unable to find active content because it is not visible.');
  }

  /**
   * Gets a specific section that meets certain criteria.
   */
  public async getSection(
    filters: SkySectionedFormSectionHarnessFilters,
  ): Promise<SkySectionedFormSectionHarness> {
    return await this.locatorFor(
      SkySectionedFormSectionHarness.with(filters),
    )();
  }

  /**
   * Gets an array of sections.
   */
  public async getSections(
    filters?: SkySectionedFormSectionHarnessFilters,
  ): Promise<SkySectionedFormSectionHarness[]> {
    if (!(await this.isSectionsVisible())) {
      throw new Error(
        'Unable to find any sectioned form sections because they are not visible.',
      );
    }
    return await this.locatorForAll(
      SkySectionedFormSectionHarness.with(filters || {}),
    )();
  }

  /**
   * Whether the section tabs are visible.
   * In mobile view, sectioned forms collapse to just content pane.
   */
  public async isSectionsVisible(): Promise<boolean> {
    const tabs = await this.#getTabs();

    if (tabs) {
      return !(await tabs.hasClass('sky-sectioned-form-tabs-hidden'));
    }
    return false;
  }
}
