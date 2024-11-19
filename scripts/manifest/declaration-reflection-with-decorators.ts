import { DeclarationReflection } from 'typedoc';

export interface DeclarationReflectionWithDecorators
  extends DeclarationReflection {
  decorators?: { name: string; arguments?: Record<string, string> }[];
}
