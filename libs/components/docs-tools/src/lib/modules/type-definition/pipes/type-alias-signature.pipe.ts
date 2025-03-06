import { Pipe, PipeTransform } from '@angular/core';
import {
  SkyManifestParentDefinition,
  SkyManifestTypeAliasDefinition,
} from '@skyux/manifest/src';

@Pipe({
  name: 'skyDocsTypeAliasSignature',
})
export class SkyDocsTypeAliasSignaturePipe implements PipeTransform {
  public transform(definition: SkyManifestParentDefinition): string {
    const def = definition as SkyManifestTypeAliasDefinition;

    return `type ${def.name} = ${def.type}`;
  }
}
