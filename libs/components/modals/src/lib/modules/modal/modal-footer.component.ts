import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { SkyModalErrorsService } from './modal-errors.service';

/**
 * Specifies content to display in the modal's footer.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, SkyStatusIndicatorModule],
})
export class SkyModalFooterComponent {
  protected readonly errorsSvc = inject(SkyModalErrorsService);
}
