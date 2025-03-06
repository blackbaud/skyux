import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  SkyManifestClassMethodDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

import { SkyDocsParameterNamePipe } from './parameter-name.pipe';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsMethodName',
})
export class SkyDocsMethodNamePipe implements PipeTransform {
  readonly #paramPipe = inject(SkyDocsParameterNamePipe);

  public transform(
    method: SkyManifestClassMethodDefinition,
    parent: SkyManifestParentDefinition,
  ): string {
    let name = '';

    if (method.isStatic) {
      name = `${parent.name}.${method.name}`;
    } else {
      name = `${method.name}`;
    }

    return (
      name +
      '(' +
      (method.parameters?.map((p) => this.#paramPipe.transform(p)).join(', ') ??
        '') +
      `): ${method.type}`
    );
  }
}
