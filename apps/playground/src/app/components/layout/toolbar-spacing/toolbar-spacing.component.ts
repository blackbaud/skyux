import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { FilterItemModalComponent } from './filter-item-modal.component';
import { ToolbarSpacingModalComponent } from './toolbar-spacing-modal.component';

/**
 * Reproduces the toolbar / filter bar / list summary padding problem described
 * in the "Toolbar/List summary > padding in containers/modals" story. Each case
 * places a component that has built-in inset padding inside a container that
 * already provides its own padding.
 */
@Component({
  selector: 'app-toolbar-spacing',
  styleUrls: ['./toolbar-spacing.component.scss'],
  templateUrl: './toolbar-spacing.component.html',
  standalone: false,
})
export class ToolbarSpacingComponent {
  public selectedFilterIds: string[] | undefined;

  protected readonly modalComponent = FilterItemModalComponent;

  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    this.#modalSvc.open(ToolbarSpacingModalComponent, {});
  }
}
