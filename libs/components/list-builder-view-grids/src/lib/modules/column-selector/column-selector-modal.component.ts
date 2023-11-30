import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkyColumnSelectorContext } from './column-selector-context';

@Component({
  selector: 'sky-column-selector',
  templateUrl: './column-selector-modal.component.html',
})
export class SkyColumnSelectorComponent {
  public newSelectedColumnIds: Array<string> = [];

  constructor(
    public context: SkyColumnSelectorContext,
    public instance: SkyModalInstance
  ) {
    this.newSelectedColumnIds = context.selectedColumnIds;
  }

  public selectedColumnsChange(selectedMap: Map<string, boolean>) {
    this.newSelectedColumnIds = [];
    selectedMap.forEach((value, key) => {
      if (value) {
        this.newSelectedColumnIds.push(key);
      }
    });
  }

  public cancelChanges() {
    this.instance.cancel();
  }

  public applyChanges() {
    this.instance.save(this.newSelectedColumnIds);
  }
}
