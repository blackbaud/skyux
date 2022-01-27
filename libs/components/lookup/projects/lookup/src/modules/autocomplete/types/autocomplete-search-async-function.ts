import { Observable } from 'rxjs';
import { SkyAutocompleteSearchAsyncArgs } from './autocomplete-search-async-args';
import { SkyAutocompleteSearchAsyncResult } from './autocomplete-search-async-result';

export type SkyAutocompleteSearchAsyncFunction = (
  args: SkyAutocompleteSearchAsyncArgs
) => Observable<SkyAutocompleteSearchAsyncResult>;
