import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  SkyManifestDocumentationTypeDefinition,
  SkyManifestFunctionDefinition,
} from '@skyux/manifest';

import { SkyDocsParameterNamePipe } from './parameter-name.pipe';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsFunctionSignature',
})
export class SkyDocsFunctionSignaturePipe implements PipeTransform {
  readonly #paramPipe = inject(SkyDocsParameterNamePipe);

  public transform(definition: SkyManifestDocumentationTypeDefinition): string {
    const def = definition as unknown as SkyManifestFunctionDefinition;

    return (
      `${def.type.startsWith('Promise') ? 'async ' : ''}function ${def.name}(` +
      (def.parameters?.map((p) => this.#paramPipe.transform(p)).join(', ') ??
        '') +
      `): ${def.type}`
    );
  }
}
