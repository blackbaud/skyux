import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParentDefinition } from '@skyux/manifest/src';

import { PropertyDefinition } from '../property-definition';

@Pipe({
  name: 'skyDocsPropertyName',
})
export class SkyDocsPropertyNamePipe implements PipeTransform {
  public transform(
    property: PropertyDefinition,
    parent: SkyManifestParentDefinition,
  ): string {
    switch (property.kind) {
      case 'enum-member': {
        return `${parent.name}.${property.name}`;
      }

      case 'interface-property': {
        return `${property.name}?: ${property.type}`;
      }

      default: {
        return `${property.name}: ${property.type}`;
      }
    }
  }
}
