import { Pipe, PipeTransform } from '@angular/core';
import {
  SkyManifestEnumerationDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsEnumerationSignature',
})
export class SkyDocsEnumerationSignaturePipe implements PipeTransform {
  public transform(definition: SkyManifestParentDefinition): string {
    const def = definition as SkyManifestEnumerationDefinition;

    return `enum ${def.name} {
  ${def.children?.map((c) => `${c.name} = ${c.type},`).join('\n  ')}
}`;
  }
}
