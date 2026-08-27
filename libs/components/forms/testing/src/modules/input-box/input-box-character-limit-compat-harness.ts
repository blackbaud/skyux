import { SkyCharacterCounterIndicatorHarness } from '../character-counter/character-counter-indicator-harness';
import {
  getCharacterLimitRatio,
  isOverCharacterLimit,
} from './utility/character-limit-label';

/**
 * @internal
 */
export class SkyInputBoxCharacterCounterIndicatorCompatHarness extends SkyCharacterCounterIndicatorHarness {
  public static override readonly hostSelector =
    'sky-input-box-character-limit';

  readonly #getLabel = this.locatorFor('.sky-input-box-character-limit-label');

  public override async getCharacterCount(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).count;
  }

  public override async getCharacterCountLimit(): Promise<number> {
    return (await getCharacterLimitRatio(await this.#getLabel())).limit;
  }

  public override async isOverLimit(): Promise<boolean> {
    return await isOverCharacterLimit(await this.#getLabel());
  }
}
