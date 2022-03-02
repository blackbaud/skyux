import { EventEmitter, Pipe, PipeTransform } from '@angular/core';

import { SkyAutocompleteSearchAsyncArgs } from './types/autocomplete-search-async-args';

/**
 * @internal
 */
@Pipe({
  name: 'skyAutocompleteSearchAsyncDisabled',
})
export class SkyAutcompleteSearchAsyncDisabledPipe implements PipeTransform {
  public transform(
    searchAsync: EventEmitter<SkyAutocompleteSearchAsyncArgs>,
    searchAsyncDisabled: boolean
  ): boolean {
    return searchAsyncDisabled || searchAsync.observers.length === 0;
  }
}
