import { Pipe, PipeTransform } from '@angular/core';
import {
  type SkyManifestParentDefinition,
  type SkyManifestTypeAliasDefinition,
} from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsTypeAliasSignature',
})
export class SkyDocsTypeAliasSignaturePipe implements PipeTransform {
  public transform(definition: SkyManifestParentDefinition): string {
    const def = definition as SkyManifestTypeAliasDefinition;

    return `type ${def.name} = ${def.type}`;
  }
}
