import { Component, computed, inject } from '@angular/core';
import { SkyAgGridHeaderInfo } from '@skyux/ag-grid';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @internal
 */
@Component({
  selector: 'sky-data-grid-column-inline-help',
  imports: [SkyHelpInlineModule],
  template: `@if (showHelpInline()) {
    <sky-help-inline
      [popoverTitle]="helpPopoverTitle()"
      [popoverContent]="helpPopoverContent()"
    />
  }`,
})
export class SkyDataGridColumnInlineHelpComponent {
  protected readonly info = inject(SkyAgGridHeaderInfo);

  protected readonly showHelpInline = computed(
    () => !!this.helpPopoverContent(),
  );

  protected readonly helpPopoverTitle = computed(
    () => this.#headerComponentParams().helpPopoverTitle,
  );

  protected readonly helpPopoverContent = computed(
    () => this.#headerComponentParams().helpPopoverContent,
  );

  readonly #headerComponentParams = computed(
    () => this.info.column?.getColDef().headerComponentParams,
  );
}
