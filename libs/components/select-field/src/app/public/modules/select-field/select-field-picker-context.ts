import { Observable } from 'rxjs/Observable';

import {
  SkySelectField,
  SkySelectFieldSelectMode
} from './types';

export class SkySelectFieldPickerContext {
  public data: Observable<SkySelectField[]>;
  public headingText?: string;

  /**
   * When `inMemorySearchEnabled` is `false`, it will circumvent the list-builder search function,
   * allowing consumers to provide results from a remote source, by updating the `data` value.
   */
  public inMemorySearchEnabled: boolean = true;

  public selectedValue?: any;
  public selectMode?: SkySelectFieldSelectMode;
  public showAddNewRecordButton: boolean = false;
}
