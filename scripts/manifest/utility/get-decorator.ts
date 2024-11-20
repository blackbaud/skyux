import { DeclarationReflectionWithDecorators } from 'manifest/types/declaration-reflection-with-decorators';

export function getDecorator(
  decl: DeclarationReflectionWithDecorators,
): string | undefined {
  return decl.decorators?.[0]?.name;
}
