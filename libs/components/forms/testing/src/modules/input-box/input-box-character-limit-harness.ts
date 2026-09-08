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

  public async getCharacterCount(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).count;
  }

  public async getCharacterLimit(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).limit;
  }

  public async isOverCharacterLimit(): Promise<boolean> {
    return await isOverCharacterLimit(await this.#getLabel());
  }
}
