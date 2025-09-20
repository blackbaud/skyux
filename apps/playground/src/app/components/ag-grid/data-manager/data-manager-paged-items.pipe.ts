import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataManagerPagedItems',
})
export class DataManagerPagedItemsPipe implements PipeTransform {
  public transform(
    items: unknown[],
    pageSize: number,
    currentPage: number,
  ): unknown[] {
    const startIndex = (currentPage - 1) * pageSize;

    return items.slice(startIndex, startIndex + pageSize);
  }
}
