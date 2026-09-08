import { TestElement } from '@angular/cdk/testing';

/**
 * @internal
 */
export async function getCharacterLimitRatio(
  labelEl: TestElement,
): Promise<{ count: number; limit: number }> {
  const text = (await labelEl.text()).trim();
  const parts = text.split('/');
  const countText = parts[0]?.trim();
  const limitText = parts[1]?.trim();
  const count = Number(countText);
  const limit = Number(limitText);

  // The label mirrors whatever `characterLimit` coerced to, which allows
  // decimals and negatives, so don't restrict this to digits.
  if (
    parts.length !== 2 ||
    !countText ||
    !limitText ||
    isNaN(count) ||
    isNaN(limit)
  ) {
    throw new Error(
      `Expected the character limit label to read "count/limit" but found "${text}".`,
    );
  }

  return { count, limit };
}

/**
 * @internal
 */
export async function isOverCharacterLimit(
  labelEl: TestElement,
): Promise<boolean> {
  return await labelEl.hasClass('sky-error-label');
}
