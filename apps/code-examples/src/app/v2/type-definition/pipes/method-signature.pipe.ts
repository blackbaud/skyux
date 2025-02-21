import { Pipe, PipeTransform, inject } from '@angular/core';
import { SkyManifestClassMethodDefinition } from '@skyux/manifest';

import { SkyDocsParameterNamePipe } from './parameter-name.pipe';

@Pipe({
  name: 'skyDocsMethodSignature',
})
export class SkyDocsMethodSignaturePipe implements PipeTransform {
  readonly #paramPipe = inject(SkyDocsParameterNamePipe);

  public transform(method: SkyManifestClassMethodDefinition): string {
    return (
      `public ${method.isStatic ? 'static ' : ''}${method.name}(` +
      (method.parameters?.map((p) => this.#paramPipe.transform(p)).join(', ') ??
        '') +
      `): ${method.type}`
    );
  }
}
