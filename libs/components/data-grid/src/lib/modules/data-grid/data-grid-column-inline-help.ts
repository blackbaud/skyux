import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
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
      [helpKey]="helpKey()"
      [popoverTitle]="helpPopoverTitle()"
      [popoverContent]="helpPopoverContent()"
    />
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDataGridColumnInlineHelp {
  protected readonly info = inject(SkyAgGridHeaderInfo);

  protected readonly showHelpInline = computed(
    () => !!this.helpPopoverContent() || !!this.helpKey(),
  );

  protected readonly helpPopoverTitle = computed(
    () => this.#headerComponentParams()?.helpPopoverTitle,
  );

  protected readonly helpPopoverContent = computed(
    () => this.#headerComponentParams()?.helpPopoverContent,
  );

  protected readonly helpKey = computed(
    () => this.#headerComponentParams()?.helpKey,
  );

  readonly #headerComponentParams = computed(
    () => this.info.column?.getColDef().headerComponentParams,
  );
}
