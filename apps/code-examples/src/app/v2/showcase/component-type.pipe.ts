import { Pipe, PipeTransform, Type, inject } from '@angular/core';

import { SKY_SHOWCASE_EXAMPLES } from './examples-token';

@Pipe({
  name: 'skyDocsExampleNameToComponentType',
})
export class SkyDocsExampleNameToComponentTypePipe implements PipeTransform {
  readonly #examples = inject(SKY_SHOWCASE_EXAMPLES);

  public transform(componentName: string): Type<unknown> {
    return this.#examples[componentName];
  }
}
