import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SkyAgGridHeaderInfo } from '@skyux/ag-grid';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

@Component({
  selector: 'sky-grid-inline-help',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgTemplateOutlet,
    SkyHelpInlineModule,
    SkyPopoverModule,
  ],
  templateUrl: './grid-inline-help.component.html',
})
export class SkyGridInlineHelpComponent {
  protected readonly headerInfo = inject(SkyAgGridHeaderInfo);
}
