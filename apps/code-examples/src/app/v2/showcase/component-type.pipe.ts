import { Pipe, PipeTransform, Type, inject } from '@angular/core';

import { SKY_DOCS_CODE_EXAMPLE_COMPONENTS } from './examples-token';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsExampleNameToComponentType',
})
export class SkyDocsExampleNameToComponentTypePipe implements PipeTransform {
  readonly #examples = inject(SKY_DOCS_CODE_EXAMPLE_COMPONENTS);

  public transform(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
