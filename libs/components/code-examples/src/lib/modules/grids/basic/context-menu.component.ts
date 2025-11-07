import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

import { GridDemoRow } from './data';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDropdownModule],
})
export class ContextMenuComponent {
  public readonly row = input<GridDemoRow>();

  protected readonly contextMenuAriaLabel = computed(
    () => `Context menu for ${this.row()?.name}`,
  );
  protected readonly deleteAriaLabel = computed(
    () => `Delete ${this.row()?.name}`,
  );
  protected readonly markInactiveAriaLabel = computed(
    () => `Mark ${this.row()?.name} inactive`,
  );
  protected readonly moreInfoAriaLabel = computed(
    () => `More info for ${this.row()?.name}`,
  );

  protected actionClicked(action: string): void {
    alert(`${action} clicked for ${this.row()?.name}`);
  }
}
