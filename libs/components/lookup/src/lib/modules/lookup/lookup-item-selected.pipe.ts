import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'skyLookupItemSelected',
})
export class SkyLookupItemSelectedPipe implements PipeTransform {
  public transform(id: unknown, selectedIdMap: Map<unknown, unknown>): boolean {
    return selectedIdMap.has(id);
  }
}
