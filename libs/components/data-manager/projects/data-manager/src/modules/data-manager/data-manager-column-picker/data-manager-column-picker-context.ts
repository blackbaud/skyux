import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';

import { SkyDataManagerColumnPickerSortStrategy } from '../models/data-manager-column-picker-sort-strategy';

export class SkyDataManagerColumnPickerContext {
  constructor(
    public columnOptions: SkyDataManagerColumnPickerOption[],
    public displayedColumnIds: string[],
    public columnPickerSortStrategy: SkyDataManagerColumnPickerSortStrategy = SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical
  ) {}
}
