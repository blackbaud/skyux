import { Pipe, PipeTransform } from '@angular/core';
import {
  SkyManifestInterfaceDefinition,
  SkyManifestParentDefinition,
} from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsInterfaceSignature',
})
export class SkyDocsInterfaceSignaturePipe implements PipeTransform {
  public transform(definition: SkyManifestParentDefinition): string {
    const def = definition as SkyManifestInterfaceDefinition;

    if (def.children) {
      return `interface ${def.name} {
  ${def.children
    ?.map((c) => {
      return `${c.name}${c.isOptional ? '?' : ''}: ${c.type};`;
    })
    .join('\n  ')}
}`;
    }

    return `interface ${def.name} {}`;
  }
}
