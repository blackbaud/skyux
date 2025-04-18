import type { DeclarationReflectionWithDecorators } from '../types/declaration-reflection-with-decorators.js';

export function getDecorator(
  reflection: DeclarationReflectionWithDecorators,
): string | undefined {
  return reflection.decorators?.[0]?.name;
}
