import { TestElement } from '@angular/cdk/testing';

/**
 * @internal
 */
export async function getCharacterLimitRatio(
  labelEl: TestElement,
): Promise<{ count: number; limit: number }> {
  const text = (await labelEl.text()).trim();
  const ratio = /^(\d+)\/(\d+)$/.exec(text);

  if (!ratio) {
    throw new Error(
      `Expected the character limit label to read "count/limit" but found "${text}".`,
    );
  }

  return { count: +ratio[1], limit: +ratio[2] };
}

/**
 * @internal
 */
export async function isOverCharacterLimit(
  labelEl: TestElement,
): Promise<boolean> {
  return await labelEl.hasClass('sky-error-label');
}
