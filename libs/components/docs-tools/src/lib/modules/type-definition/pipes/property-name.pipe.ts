import { Pipe, PipeTransform } from '@angular/core';
import {
  type SkyManifestClassPropertyDefinition,
  type SkyManifestParentDefinition,
} from '@skyux/manifest';

import { PropertyDefinition } from '../property-definition';

/**
 * @internal
 */
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
        return `${property.name}${property.isOptional ? '?' : ''}: ${property.type}`;
      }

      default: {
        return `${(property as SkyManifestClassPropertyDefinition).isStatic ? 'static ' : ''}${property.name}: ${property.type}`;
      }
    }
  }
}
