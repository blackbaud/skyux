import { Observable } from 'rxjs/Observable';

import {
  SkySelectField,
  SkySelectFieldSelectMode
} from './types';

export class SkySelectFieldPickerContext {
  public data: Observable<SkySelectField[]>;
  public headingText?: string;
  public selectedValue?: any;
  public selectMode?: SkySelectFieldSelectMode;
}
