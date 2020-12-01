import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

import {
  SkyThemeService
} from '@skyux/theme';

/**
 * Displays a label above the file attachment element.
 */
@Component({
  selector: 'sky-file-attachment-label',
  templateUrl: './file-attachment-label.component.html',
  styleUrls: [
    'file-attachment-label.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFileAttachmentLabelComponent {

  constructor(
    public themeSvc: SkyThemeService
  ) {}

}
