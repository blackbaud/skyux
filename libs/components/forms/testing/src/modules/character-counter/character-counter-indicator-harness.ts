import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyCharacterCounterIndicatorHarnessFilters } from './character-counter-indicator-harness-filters';

type LabelParts = {
  count: number;
  limit: number;
};

/**
 * Harness for interacting with a character counter indicator component in tests.
 */
export class SkyCharacterCounterIndicatorHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-character-counter-indicator';

  #getLabel = this.locatorFor('.sky-character-count-label');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyCharacterCounterIndicatorHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyCharacterCounterIndicatorHarnessFilters,
  ): HarnessPredicate<SkyCharacterCounterIndicatorHarness> {
    return SkyCharacterCounterIndicatorHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Gets the current character count.
   */
  public async getCharacterCount(): Promise<number> {
    return (await this.#getLabelParts()).count;
  }

  /**
   * Gets the character counter limit.
   */
  public async getCharacterCountLimit(): Promise<number> {
    return (await this.#getLabelParts()).limit;
  }

  /**
   * Indicates whether the character counter is in an error state because the current character
   * count is greater than the limit.
   */
  public async isOverLimit(): Promise<boolean> {
    return await (await this.#getLabel()).hasClass('sky-error-label');
  }

  async #getLabelParts(): Promise<LabelParts> {
    const label = await this.#getLabel();
    const textParts = (await label.text()).split('/');

    let labelParts: LabelParts | undefined;

    if (textParts.length === 2) {
      labelParts = {
        count: +textParts[0].trim(),
        limit: +textParts[1].trim(),
      };
    }

    if (labelParts && !isNaN(labelParts.count) && !isNaN(labelParts.limit)) {
      return labelParts;
    }

    throw new Error(
      'The character counter indicator does not contain text in the expected format.',
    );
  }
}
