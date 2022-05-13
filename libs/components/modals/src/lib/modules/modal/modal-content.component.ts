import { Component, ViewEncapsulation } from '@angular/core';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
} from '@skyux/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  selector: 'sky-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SkyMediaQueryService,
      useExisting: SkyResizeObserverMediaQueryService,
    },
  ],
})
export class SkyModalContentComponent {}
