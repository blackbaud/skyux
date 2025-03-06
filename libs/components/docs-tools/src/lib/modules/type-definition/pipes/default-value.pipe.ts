import { Pipe, PipeTransform } from '@angular/core';
import {
  type SkyManifestChildDefinition,
  type SkyManifestClassPropertyDefinition,
} from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsPropertyDefaultValue',
})
export class SkyDocsPropertyTypeDefinitionDefaultValuePipe
  implements PipeTransform
{
  public transform(prop: SkyManifestChildDefinition): string | undefined {
    return (prop as SkyManifestClassPropertyDefinition)?.defaultValue;
  }
}
