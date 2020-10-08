import {
  Component,
  ChangeDetectionStrategy
} from '@angular/core';

/**
 * Displays a label above the file attachment element.
 */
@Component({
  selector: 'sky-file-attachment-label',
  templateUrl: './file-attachment-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFileAttachmentLabelComponent { }
