import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays a label above the file attachment element.
 */
@Component({
  selector: 'sky-file-attachment-label',
  templateUrl: './file-attachment-label.component.html',
  styleUrls: ['file-attachment-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFileAttachmentLabelComponent {}
