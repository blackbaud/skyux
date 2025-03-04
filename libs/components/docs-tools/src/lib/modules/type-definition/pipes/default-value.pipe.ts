import { Pipe, PipeTransform } from '@angular/core';
import {
  SkyManifestChildDefinition,
  SkyManifestClassPropertyDefinition,
} from '@skyux/manifest/src';

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
