import { Pipe, PipeTransform } from '@angular/core';
import { SkyManifestParameterDefinition } from '@skyux/manifest';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsParameterName',
})
export class SkyDocsParameterNamePipe implements PipeTransform {
  public transform(parameter: SkyManifestParameterDefinition): string {
    return `${parameter.name}${parameter.defaultValue ? ` = ${parameter.defaultValue}` : `${parameter.isOptional ? '?' : ''}: ${parameter.type}`}`;
  }
}
