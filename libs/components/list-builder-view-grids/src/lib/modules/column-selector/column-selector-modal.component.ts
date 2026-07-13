import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkyColumnSelectorContext } from './column-selector-context';

@Component({
  selector: 'sky-column-selector',
  templateUrl: './column-selector-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyColumnSelectorComponent {
  public readonly context = inject(SkyColumnSelectorContext);
  public readonly instance = inject(SkyModalInstance);

  public newSelectedColumnIds: string[] = this.context.selectedColumnIds;

  public selectedColumnsChange(selectedMap: Map<string, boolean>): void {
    this.newSelectedColumnIds = [];
    selectedMap.forEach((value, key) => {
      if (value) {
        this.newSelectedColumnIds.push(key);
      }
    });
  }

  public cancelChanges(): void {
    this.instance.cancel();
  }

  public applyChanges(): void {
    this.instance.save(this.newSelectedColumnIds);
  }
}
