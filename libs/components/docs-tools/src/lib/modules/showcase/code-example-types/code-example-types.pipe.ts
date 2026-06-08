import { Pipe, PipeTransform, Type, inject } from '@angular/core';

import { SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES } from './code-example-types-token';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsCodeExampleNameToComponentType',
})
export class SkyDocsCodeExampleNameToComponentTypePipe implements PipeTransform {
  readonly #examples = inject(SKY_DOCS_CODE_EXAMPLE_COMPONENT_TYPES);

  public transform(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
