import { type DeclarationReflection } from 'typedoc';

export interface DeclarationReflectionDecorator {
  name: string;
  arguments?: Record<string, string>;
}

/**
 * TypeDoc's `DeclarationReflection` with the addition of decorators.
 * (See 'plugins/typedoc-plugin-decorators.mjs').
 */
export interface DeclarationReflectionWithDecorators
  extends DeclarationReflection {
  decorators?: DeclarationReflectionDecorator[];
}
