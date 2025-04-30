import { HarnessPredicate } from '@angular/cdk/testing';

import { SkyVerticalTabButtonHarness } from '../vertical-tabset/vertical-tab-button-harness';
import { SkyVerticalTabContentHarness } from '../vertical-tabset/vertical-tab-content-harness';

import { SkySectionedFormSectionContentHarness } from './sectioned-form-section-content-harness';
import { SkySectionedFormSectionHarnessFilters } from './sectioned-form-section-harness-filters';

/**
 * Harness for interacting with a sectioned form section component in tests.
 */
export class SkySectionedFormSectionHarness extends SkyVerticalTabButtonHarness {
  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySectionedFormSectionHarness` that meets certain criteria.
   */
  public static override with(
    filters: SkySectionedFormSectionHarnessFilters,
  ): HarnessPredicate<SkySectionedFormSectionHarness> {
    return SkySectionedFormSectionHarness.getDataSkyIdPredicate(
      filters,
    ).addOption(
      'sectionHeading',
      filters.sectionHeading,
      async (harness, heading) => {
        const sectionHeading = await harness.getSectionHeading();
        return sectionHeading === heading;
      },
    );
  }

  /**
   * Clicks the section to activate.
   */
  public override async click(): Promise<void> {
    await super.click();
  }

  /**
   * Gets the `SkySectionedFormSectionContentHarness` for this section.
   */
  public async getSectionContent(): Promise<SkySectionedFormSectionContentHarness> {
    return await this.documentRootLocatorFactory().locatorFor(
      SkySectionedFormSectionContentHarness.with({
        tabId: await this.getTabId(),
      }),
    )();
  }

  /**
   * Gets the section heading.
   */
  public async getSectionHeading(): Promise<string> {
    return await this.getTabHeading();
  }

  /**
   * Gets the section item count.
   */
  public async getSectionItemCount(): Promise<number> {
    return await this.getTabHeaderCount();
  }

  /**
   * Gets the harness for this tab.
   * Replacing with getSectionContent.
   * @internal
   */
  /* istanbul ignore next */
  public override async getTabContent(): Promise<SkyVerticalTabContentHarness> {
    return await super.getTabContent();
  }

  /**
   * Gets the tab header count.
   * Replacing with getSectionItemCount.
   * @internal
   */
  public override async getTabHeaderCount(): Promise<number> {
    return await super.getTabHeaderCount();
  }

  /**
   * Gets the tab heading text.
   * Replacing with getSectionHeading.
   * @internal
   */
  public override async getTabHeading(): Promise<string> {
    return await super.getTabHeading();
  }

  /**
   * Whether the section is active.
   */
  public override async isActive(): Promise<boolean> {
    return await super.isActive();
  }

  /**
   * Whether the section is disabled.
   * This isn't used on sectioned forms.
   * @internal
   */
  /* istanbul ignore next */
  public override async isDisabled(): Promise<boolean> {
    return await super.isDisabled();
  }
}
