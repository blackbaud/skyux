import {
  Component,
  Optional
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

/**
 * Specifies a header for the modal.
 */
@Component({
  selector: 'sky-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: [
    './modal-header.component.scss'
  ]
})
export class SkyModalHeaderComponent {

  constructor(
    @Optional() public themeSvc?: SkyThemeService
  ) { }

}
