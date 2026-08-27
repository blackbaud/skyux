import { SkyComponentHarness } from '@skyux/core/testing';
import {
  getCharacterLimitRatio,
  isOverCharacterLimit,
} from './utility/character-limit-label';

/**
 * @internal
 */
export class SkyInputBoxCharacterLimitHarness extends SkyComponentHarness {
  public static readonly hostSelector = 'sky-input-box-character-limit';

  readonly #getLabel = this.locatorFor('.sky-input-box-character-limit-label');

  /**
   * Gets the current character count.
   */
  public async getCharacterCount(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).count;
  }

  /**
   * Gets the character limit.
   */
  public async getCharacterLimit(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).limit;
  }

  /**
   * Whether the character count has exceeded the character limit.
   */
  public async isOverCharacterLimit(): Promise<boolean> {
    return await isOverCharacterLimit(await this.#getLabel());
  }
}
