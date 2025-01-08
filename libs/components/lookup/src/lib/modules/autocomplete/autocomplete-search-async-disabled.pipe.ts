import { EventEmitter, Pipe, PipeTransform } from '@angular/core';

import { SkyAutocompleteSearchAsyncArgs } from './types/autocomplete-search-async-args';

/**
 * @internal
 */
@Pipe({
  name: 'skyAutocompleteSearchAsyncDisabled',
  standalone: false,
})
export class SkyAutocompleteSearchAsyncDisabledPipe implements PipeTransform {
  public transform(
    searchAsync: EventEmitter<SkyAutocompleteSearchAsyncArgs>,
    searchAsyncDisabled: boolean | undefined,
  ): boolean {
    return searchAsyncDisabled || searchAsync.observers.length === 0;
  }
}
