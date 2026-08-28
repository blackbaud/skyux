import { TestElement } from '@angular/cdk/testing';

/**
 * @internal
 */
export async function getCharacterLimitRatio(
  labelEl: TestElement,
): Promise<{ count: number; limit: number }> {
  const text = (await labelEl.text()).trim();
  const parts = text.split('/');
  const count = Number(parts[0]);
  const limit = Number(parts[1]);

  // The label mirrors whatever `characterLimit` coerced to, which allows
  // decimals and negatives, so don't restrict this to digits.
  if (parts.length !== 2 || isNaN(count) || isNaN(limit)) {
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
