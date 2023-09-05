import { Pipe, PipeTransform } from '@angular/core';

/**
 * @internal
 */
@Pipe({
  standalone: true,
  name: 'skySelectionModalItemSelected',
})
export class SkySelectionModalItemSelectedPipe implements PipeTransform {
  public transform(id: unknown, selectedIdMap: Map<unknown, unknown>): boolean {
    return selectedIdMap.has(id);
  }
}
