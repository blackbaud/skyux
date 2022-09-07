import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Displays a label above the file attachment element. To display a help button beside the label, include a help button
 * element, such as `sky-help-inline`, in the `sky-file-attachment-label` element and a `sky-control-help` CSS class on
 * that help button element.
 */
@Component({
  selector: 'sky-file-attachment-label',
  templateUrl: './file-attachment-label.component.html',
  styleUrls: ['file-attachment-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFileAttachmentLabelComponent {}
